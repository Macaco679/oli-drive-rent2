import basaltBranco from "@/assets/vehicles/basalt-branco-2024.jpeg";
import kicksPreto from "@/assets/vehicles/kicks-preto-2024.png";
import hb20Prata from "@/assets/vehicles/hb20-prata-2024.png";

const BENEFITS_HEADING = "Por que escolher a OLI?";
const decorated = new WeakSet<HTMLElement>();
let scheduled = false;

const content = [
  {
    variant: "contracts",
    title: "Contratos digitais",
    description: "Assine e acompanhe cada etapa com registros centralizados e mais segurança para locador e motorista.",
    image: basaltBranco,
  },
  {
    variant: "inspection",
    title: "Vistoria com fotos",
    description: "Compare o estado do carro antes e depois do aluguel com registros visuais organizados e fáceis de consultar.",
    image: kicksPreto,
  },
  {
    variant: "driver",
    title: "Para motoristas de app",
    description: "Encontre carros prontos para rodar com planos flexíveis e custos mais previsíveis no dia a dia.",
    image: hb20Prata,
  },
] as const;

const mediaMarkup = (variant: string, image: string) => {
  if (variant === "contracts") {
    return `
      <div class="oli-benefit-art oli-benefit-art--contracts" aria-hidden="true">
        <img class="oli-benefit-art__ghost-car" src="${image}" alt="" />
        <div class="oli-contract-shield"><span>✓</span></div>
        <div class="oli-contract-tablet">
          <i class="oli-contract-camera"></i>
          <strong>CONTRATO</strong>
          <span class="oli-contract-line wide"></span>
          <span class="oli-contract-line"></span>
          <span class="oli-contract-line short"></span>
          <div class="oli-contract-signature">assinatura digital</div>
          <div class="oli-contract-secure"><span>▣</span><b>Documento protegido</b><em>✓</em></div>
        </div>
        <div class="oli-contract-key">⌁</div>
      </div>`;
  }

  if (variant === "inspection") {
    return `
      <div class="oli-benefit-art oli-benefit-art--inspection" aria-hidden="true">
        <div class="oli-inspection-orbit"></div>
        <img class="oli-benefit-car oli-benefit-car--inspection" src="${image}" alt="" />
        <span class="oli-focus-point p1">✓</span>
        <span class="oli-focus-point p2">✓</span>
        <span class="oli-focus-point p3">✓</span>
        <div class="oli-inspection-phone">
          <i></i><strong>Capturando foto</strong><span class="phone-frame"></span><b></b>
        </div>
        <div class="oli-inspection-list"><strong>Checklist</strong><span>✓ Carroceria</span><span>✓ Pneus</span><span>✓ Faróis</span></div>
      </div>`;
  }

  return `
    <div class="oli-benefit-art oli-benefit-art--driver" aria-hidden="true">
      <div class="oli-driver-road"></div>
      <div class="oli-driver-route r1"></div><div class="oli-driver-route r2"></div>
      <div class="oli-driver-pin">⌖</div>
      <div class="oli-driver-phone"><i></i><strong>ROTA ATIVA</strong><span class="route-path"></span><b>⌖</b></div>
      <img class="oli-benefit-car oli-benefit-car--driver" src="${image}" alt="" />
      <div class="oli-driver-earnings"><b>R$</b><span>mais previsibilidade</span></div>
      <div class="oli-driver-ready">🚗 <span>pronto para rodar</span></div>
    </div>`;
};

const bindTilt = (card: HTMLElement) => {
  if (decorated.has(card)) return;
  decorated.add(card);

  card.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    card.style.setProperty("--tilt-x", `${(0.5 - y) * 11}deg`);
    card.style.setProperty("--tilt-y", `${(x - 0.5) * 13}deg`);
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
  const lead = section.querySelector<HTMLElement>(".oli-benefits-3d__lead");
  if (!lead && heading) {
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
    if (title) title.textContent = item.title;
    if (description) description.textContent = item.description;

    if (!card.querySelector(".oli-benefit-tilt__media")) {
      const media = document.createElement("div");
      media.className = "oli-benefit-tilt__media";
      media.innerHTML = mediaMarkup(item.variant, item.image);
      card.insertBefore(media, card.firstChild);
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
