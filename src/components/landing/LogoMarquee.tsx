import uber from "@/assets/logos/uber.png";
import logo99 from "@/assets/logos/99.png";
import indrive from "@/assets/logos/indrive.png";
import ifood from "@/assets/logos/ifood.png";
import rappi from "@/assets/logos/rappi.png";
import loggi from "@/assets/logos/loggi.png";
import mercadoLivre from "@/assets/logos/mercado-livre.png";
import shopee from "@/assets/logos/shopee.png";

export const LogoMarquee = () => {
  const apps = [
    { name: "Uber", logo: uber },
    { name: "99", logo: logo99 },
    { name: "InDrive", logo: indrive },
    { name: "iFood", logo: ifood },
    { name: "Rappi", logo: rappi },
    { name: "Loggi", logo: loggi },
    { name: "Mercado Livre", logo: mercadoLivre },
    { name: "Shopee", logo: shopee },
  ];

  // Duplicate for seamless loop
  const allApps = [...apps, ...apps];

  return (
    <section className="py-12 pb-6 bg-muted/50 overflow-hidden">
      <div className="container mb-8">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-foreground">
          Compatível com os principais apps de mobilidade e entrega
        </h2>
      </div>
      
      <div className="relative flex overflow-hidden">
        <div className="flex animate-marquee gap-12 px-6">
          {allApps.map((app, index) => (
            <div
              key={index}
              className="flex items-center justify-center min-w-[140px] h-20"
            >
              <img
                src={app.logo}
                alt={app.name}
                className="max-h-14 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
