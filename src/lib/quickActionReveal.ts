const QUICK_ACTION_HEADING = "O que você procura?";
const QUICK_ACTION_HEADING_UPDATED = "Seu próximo passo começa aqui";

const actionCopy = [
  {
    id: "app",
    title: "Alugue para trabalhar com app",
    description:
      "Encontre veículos ideais para Uber, 99 e outros apps, com opções pensadas para quem precisa de praticidade e disponibilidade no dia a dia.",
    cta: "Encontrar carro para app",
  },
  {
    id: "travel",
    title: "Pegue a estrada com liberdade",
    description:
      "Escolha um carro confortável para fins de semana, férias ou viagens mais longas, com espaço e flexibilidade para acompanhar o seu roteiro.",
    cta: "Encontrar carro para viajar",
  },
  {
    id: "owner",
    title: "Transforme seu carro em renda",
    description:
      "Cadastre seu veículo na OLI, defina quando ele fica disponível e transforme os períodos em que estaria parado em uma nova fonte de renda.",
    cta: "Cadastrar meu carro",
  },
] as const;

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
            const element = entry.target as HTMLElement;

            // Reveal only after a meaningful portion of the card enters the viewport.
            // When it leaves, reset it so the left/right entrance also works while
            // scrolling back up through the page.
            if (entry.isIntersecting && entry.intersectionRatio >= 0.16) {
              requestAnimationFrame(() => element.classList.add("is-visible"));
              return;
            }

            if (!entry.isIntersecting || entry.intersectionRatio <= 0.02) {
              element.classList.remove("is-visible");
            }
          });
        },
        {
          threshold: [0, 0.02, 0.16, 0.4],
          rootMargin: "-3% 0px -6% 0px",
        }
      )
    : null;

const decorateQuickActions = () => {
  const section =
    document.querySelector<HTMLElement>(".oli-quick-actions") ??
    Array.from(document.querySelectorAll<HTMLElement>("section")).find(
      (candidate) => candidate.querySelector("h2")?.textContent?.trim() === QUICK_ACTION_HEADING
    );

  if (!section) return;

  section.classList.add("oli-quick-actions");

  const heading = section.querySelector<HTMLHeadingElement>("h2");
  if (heading) heading.textContent = QUICK_ACTION_HEADING_UPDATED;

  const stack = section.querySelector<HTMLElement>(".grid, .oli-quick-actions__stack");
  if (!stack) return;

  stack.classList.add("oli-quick-actions__stack");

  const buttons = Array.from(stack.children).filter(
    (child): child is HTMLButtonElement => child instanceof HTMLButtonElement
  );

  buttons.slice(0, 3).forEach((button, index) => {
    const copy = actionCopy[index];
    if (!copy) return;

    button.classList.add(
      "oli-quick-card",
      "oli-reveal",
      index % 2 === 0 ? "oli-reveal--left" : "oli-reveal--right"
    );
    button.dataset.oliAction = copy.id;
    button.dataset.oliCta = copy.cta;

    const title = button.querySelector<HTMLHeadingElement>("h3");
    const description = button.querySelector<HTMLParagraphElement>("p");
    if (title) title.textContent = copy.title;
    if (description) description.textContent = copy.description;

    if (decorated.has(button)) return;
    decorated.add(button);

    if (!revealObserver) {
      button.classList.add("is-visible");
      return;
    }

    // Give the browser one paint with the off-screen state before observing.
    // This prevents cards already near the viewport from skipping the transition.
    button.classList.remove("is-visible");
    requestAnimationFrame(() => revealObserver.observe(button));
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
