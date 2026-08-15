// Serve the exact 1080p master supplied by the client, without transcoding.
const TOP_HERO_SOURCE = "/videos/hero-untitled3-original.mp4";
const TOP_HERO_POSTER = "/videos/hero-untitled3-poster.jpg";
const FOOTER_SOURCE = "/videos/footer-untitled6-original.mp4";
const managed = new WeakSet<HTMLVideoElement>();
const timers = new WeakMap<HTMLVideoElement, number>();
const progressState = new WeakMap<HTMLVideoElement, { time: number; changedAt: number }>();

const isHome = () => window.location.pathname === "/home" || window.location.pathname === "/";

const getTopHero = () =>
  isHome() ? document.querySelector<HTMLVideoElement>("main > section:first-child video") : null;

const liveWallpapers = () => {
  const videos: HTMLVideoElement[] = [];
  const topHero = getTopHero();
  const footerVideos = document.querySelectorAll<HTMLVideoElement>("footer video");
  if (topHero) videos.push(topHero);
  footerVideos.forEach((video) => {
    if (video !== topHero) videos.push(video);
  });
  return videos;
};

const isTopHero = (video: HTMLVideoElement) => getTopHero() === video;

const configure = (video: HTMLVideoElement) => {
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.controls = false;

  video.setAttribute("autoplay", "");
  video.setAttribute("loop", "");
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("preload", "auto");

  if (isTopHero(video)) {
    video.setAttribute("poster", TOP_HERO_POSTER);
    if (video.getAttribute("src") !== TOP_HERO_SOURCE) {
      video.setAttribute("src", TOP_HERO_SOURCE);
      video.load();
    }
  }

  if (video.closest("footer") && video.getAttribute("src") !== FOOTER_SOURCE) {
    video.setAttribute("src", FOOTER_SOURCE);
    video.removeAttribute("poster");
    video.load();
  }
};

const play = (video: HTMLVideoElement) => {
  configure(video);

  if (video.ended) {
    try {
      video.currentTime = 0;
    } catch {
      // Metadata can still be loading while the browser recovers the stream.
    }
  }

  if (!video.paused && !video.ended && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    return;
  }

  const promise = video.play();
  promise?.catch(() => {
    // Autoplay/network recovery is retried by the events and watchdog below.
  });
};

const schedulePlay = (video: HTMLVideoElement, delay = 0) => {
  const previous = timers.get(video);
  if (previous) window.clearTimeout(previous);

  const timer = window.setTimeout(() => {
    timers.delete(video);
    play(video);
  }, delay);

  timers.set(video, timer);
};

const hardRecover = (video: HTMLVideoElement) => {
  configure(video);
  const resumeAt = Number.isFinite(video.currentTime) ? video.currentTime : 0;

  try {
    video.load();
  } catch {
    schedulePlay(video, 100);
    return;
  }

  const restoreAndPlay = () => {
    if (resumeAt > 0 && Number.isFinite(video.duration) && resumeAt < video.duration - 0.25) {
      try {
        video.currentTime = resumeAt;
      } catch {
        // Seeking can be rejected until enough metadata is available.
      }
    }
    schedulePlay(video, 0);
  };

  video.addEventListener("canplay", restoreAndPlay, { once: true, passive: true });
  window.setTimeout(() => schedulePlay(video, 0), 700);
};

const bind = (video: HTMLVideoElement) => {
  configure(video);

  if (managed.has(video)) {
    schedulePlay(video, 0);
    return;
  }

  managed.add(video);
  progressState.set(video, { time: video.currentTime || 0, changedAt: performance.now() });

  ["loadedmetadata", "loadeddata", "canplay", "canplaythrough"].forEach((eventName) => {
    video.addEventListener(eventName, () => schedulePlay(video, 0), { passive: true });
  });

  ["pause", "ended", "stalled", "waiting", "abort"].forEach((eventName) => {
    video.addEventListener(eventName, () => schedulePlay(video, 70), { passive: true });
  });

  video.addEventListener("error", () => {
    window.setTimeout(() => hardRecover(video), 350);
  });

  schedulePlay(video, 0);
};

const scan = () => liveWallpapers().forEach(bind);
const resumeAll = () => liveWallpapers().forEach((video) => schedulePlay(video, 0));

const watchdog = () => {
  const now = performance.now();

  liveWallpapers().forEach((video) => {
    configure(video);

    if (video.paused || video.ended || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      schedulePlay(video, 0);
    }

    const previous = progressState.get(video) ?? { time: video.currentTime || 0, changedAt: now };
    const moved = Math.abs((video.currentTime || 0) - previous.time) > 0.025;

    if (moved) {
      progressState.set(video, { time: video.currentTime || 0, changedAt: now });
      return;
    }

    if (document.visibilityState === "visible" && !video.seeking && now - previous.changedAt > 3500) {
      progressState.set(video, { time: video.currentTime || 0, changedAt: now });
      hardRecover(video);
    }
  });
};

if (typeof window !== "undefined" && typeof document !== "undefined") {
  const start = () => {
    scan();

    new MutationObserver(scan).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    window.addEventListener("focus", resumeAll, { passive: true });
    window.addEventListener("pageshow", resumeAll, { passive: true });
    window.addEventListener("online", resumeAll, { passive: true });
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") resumeAll();
    });

    window.setInterval(watchdog, 750);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
}
