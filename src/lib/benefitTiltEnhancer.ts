const BENEFITS_HEADING = "Por que escolher a OLI?";
const decorated = new WeakSet<HTMLElement>();
let scheduled = false;

const content = [
  {
    variant: "contracts",
    title: "Contratos digitais",
    description: "Assine e acompanhe cada etapa com registros centralizados e mais segurança para locador e motorista.",
    image: "/benefits/benefit-contracts-v2.jpg",
    eyebrow: "Segurança digital",
  },
  {
    variant: "inspection",
    title: "Vistoria com fotos",
    description: "Compare o estado do carro antes e depois do aluguel com registros visuais organizados e fáceis de consultar.",
    image: "/benefits/benefit-inspection-v4.svg",
    eyebrow: "Registro visual",
  },
  {
    variant: "driver",
    title: "Para motoristas de app",
    description: "Encontre carros prontos para rodar com planos flexíveis e custos mais previsíveis no dia a dia.",
    image: "/benefits/benefit-driver-v2.jpg",
    eyebrow: "Pronto para rodar",
  },
] as const;

const bindTilt = (card: HTMLElement) => {
  if (decorated.has(card)) return;
  decorated.add(card);

  card.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    card.style.setProperty("--tilt-x", `${(0.5 - y) * 7}deg`);
    card.style.setProperty("--tilt-y", `${(x - 0.5) * 9}deg`);
    card.style.setProperty("--glare-x", `${x * 100}%`);
    card.style.setProperty("--glare-y", `${y * 100}%`);
    card.style.setProperty("--glare-opacity", "1");
  });

  const reset = () => {
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
    card.style.setProperty("--glare-opacity", "0");
  };

  card.addEventListener("pointerleave", reset);
  card.addEventListener("pointercancel", reset);
};

const createMedia = (item: (typeof content)[number]) => {
  const media = document.createElement("div");
  media.className = "oli-benefit-tilt__media";
  media.dataset.variant = item.variant;

  const image = document.createElement("img");
  image.className = "oli-benefit-tilt__image";
  image.src = item.image;
  image.alt = "";
  image.decoding = "async";
  image.loading = "lazy";

  const gridFx = document.createElement("span");
  gridFx.className = "oli-benefit-tilt__gridfx";
  gridFx.setAttribute("aria-hidden", "true");

  const glow = document.createElement("span");
  glow.className = "oli-benefit-tilt__media-glow";
  glow.setAttribute("aria-hidden", "true");

  const badge = document.createElement("span");
  badge.className = "oli-benefit-tilt__eyebrow";
  badge.textContent = item.eyebrow;

  media.append(image, gridFx, glow, badge);
  return media;
};

const decorateBenefits = () => {
  const section = Array.from(document.querySelectorAll<HTMLElement>("section")).find(
    (candidate) => candidate.querySelector("h2")?.textContent?.trim() === BENEFITS_HEADING
  );
  if (!section) return;

  section.classList.add("oli-benefits-3d");
  const heading = section.querySelector("h2");
  const grid = section.querySelector<HTMLElement>(".grid, .oli-benefits-3d__grid");
  if (!grid) return;

  grid.classList.add("oli-benefits-3d__grid");

  if (!section.querySelector(".oli-benefits-3d__lead") && heading) {
    const paragraph = document.createElement("p");
    paragraph.className = "oli-benefits-3d__lead";
    paragraph.textContent = "Segurança, transparência e praticidade em cada etapa do aluguel.";
    heading.insertAdjacentElement("afterend", paragraph);
  }

  const cards = Array.from(grid.children).filter((node): node is HTMLElement => node instanceof HTMLElement).slice(0, 3);
  cards.forEach((card, index) => {
    const item = content[index];
    if (!item) return;
    card.classList.add("oli-benefit-tilt", `oli-benefit-tilt--${item.variant}`);

    const title = card.querySelector("h3");
    const description = card.querySelector("p");
    if (title && title.textContent !== item.title) title.textContent = item.title;
    if (description && description.textContent !== item.description) description.textContent = item.description;

    const existingMedia = card.querySelector<HTMLElement>(".oli-benefit-tilt__media");
    const existingImage = existingMedia?.querySelector<HTMLImageElement>(".oli-benefit-tilt__image");
    if (existingMedia && existingMedia.dataset.variant !== item.variant) existingMedia.remove();
    if (!card.querySelector(".oli-benefit-tilt__media")) {
      card.insertBefore(createMedia(item), card.firstChild);
    } else if (existingImage && existingImage.getAttribute("src") !== item.image) {
      existingImage.src = item.image;
    }

    bindTilt(card);
  });
};

const schedule = () => {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    decorateBenefits();
  });
};

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", schedule, { once: true });
else schedule();

new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });