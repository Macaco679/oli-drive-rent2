const QUICK_ACTION_HEADING = "O que você procura?";

const decorated = new WeakSet<HTMLElement>();
let frame = 0;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const revealObserver =
  typeof window !== "undefined" && "IntersectionObserver" in window && !prefersReducedMotion()
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const element = entry.target as HTMLElement;
            element.classList.add("is-visible");
            revealObserver?.unobserve(element);
          });
        },
        {
          threshold: 0.18,
          rootMargin: "0px 0px -8% 0px",
        }
      )
    : null;

const decorateQuickActions = () => {
  const section = Array.from(document.querySelectorAll<HTMLElement>("section")).find(
    (candidate) => candidate.querySelector("h2")?.textContent?.trim() === QUICK_ACTION_HEADING
  );

  if (!section) return;

  section.classList.add("oli-quick-actions");
  const stack = section.querySelector<HTMLElement>(".grid");
  if (!stack) return;

  stack.classList.add("oli-quick-actions__stack");

  const buttons = Array.from(stack.children).filter(
    (child): child is HTMLButtonElement => child instanceof HTMLButtonElement
  );

  const actions = ["app", "travel", "owner"];

  buttons.slice(0, 3).forEach((button, index) => {
    button.classList.add(
      "oli-quick-card",
      "oli-reveal",
      index % 2 === 0 ? "oli-reveal--left" : "oli-reveal--right"
    );
    button.dataset.oliAction = actions[index];

    if (decorated.has(button)) return;
    decorated.add(button);

    if (!revealObserver) {
      button.classList.add("is-visible");
      return;
    }

    revealObserver.observe(button);
  });
};

const scheduleDecoration = () => {
  if (frame) cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    frame = 0;
    decorateQuickActions();
  });
};

if (typeof window !== "undefined" && typeof document !== "undefined") {
  const start = () => {
    scheduleDecoration();

    const root = document.getElementById("root") ?? document.body;
    const mutationObserver = new MutationObserver(scheduleDecoration);
    mutationObserver.observe(root, { childList: true, subtree: true });

    window.addEventListener("pageshow", scheduleDecoration, { passive: true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
}
