import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

// Import car images
import kicksPreto from "@/assets/cars/kicks-preto-2024.png";
import kicksPrata from "@/assets/cars/kicks-prata-2024.png";
import hb20 from "@/assets/cars/hb20-prata-2024.png";
import onixPrata from "@/assets/cars/onix-prata-2019.jpeg";
import argo from "@/assets/cars/argo-prata-2026.jpeg";
import onixAzul from "@/assets/cars/onix-azul-2022.png";
import basalt from "@/assets/cars/basalt-branco-2024.jpeg";
import prisma from "@/assets/cars/prisma-preto-2019.jpeg";
import kiaBongo from "@/assets/cars/kiabongo-2020.png";
import { Badge } from "@/components/ui/badge";

const WHATSAPP_NUMBER = "5511919134094";

interface Car {
  name: string;
  year: string;
  image: string;
  weeklyPrice: string;
  dailyPrice: string;
  deposit: string;
  available: boolean;
}

const cars: Car[] = [
  {
    name: "Nissan Kicks Preto",
    year: "2024",
    image: kicksPreto,
    weeklyPrice: "R$ 1.200",
    dailyPrice: "R$ 300",
    deposit: "R$ 3.000",
    available: true,
  },
  {
    name: "Nissan Kicks Prata",
    year: "2024",
    image: kicksPrata,
    weeklyPrice: "R$ 1.200",
    dailyPrice: "R$ 300",
    deposit: "R$ 3.000",
    available: true,
  },
  {
    name: "Hyundai HB20 Prata",
    year: "2024",
    image: hb20,
    weeklyPrice: "R$ 900",
    dailyPrice: "R$ 200",
    deposit: "R$ 2.000",
    available: false,
  },
  {
    name: "Chevrolet Onix Prata",
    year: "2019",
    image: onixPrata,
    weeklyPrice: "R$ 800",
    dailyPrice: "R$ 200",
    deposit: "R$ 2.000",
    available: false,
  },
  {
    name: "Fiat Argo",
    year: "2026",
    image: argo,
    weeklyPrice: "R$ 900",
    dailyPrice: "R$ 200",
    deposit: "R$ 2.000",
    available: false,
  },
  {
    name: "Chevrolet Onix Azul Sedan",
    year: "2022",
    image: onixAzul,
    weeklyPrice: "R$ 900",
    dailyPrice: "R$ 200",
    deposit: "R$ 2.000",
    available: true,
  },
  {
    name: "Chevrolet Basalt Branco",
    year: "2024",
    image: basalt,
    weeklyPrice: "R$ 1.200",
    dailyPrice: "R$ 300",
    deposit: "R$ 3.000",
    available: false,
  },
  {
    name: "Chevrolet Prisma Preto",
    year: "2019",
    image: prisma,
    weeklyPrice: "R$ 800",
    dailyPrice: "R$ 200",
    deposit: "R$ 2.000",
    available: true,
  },
  {
    name: "Kia Bongo Refrigerado",
    year: "2020",
    image: kiaBongo,
    weeklyPrice: "R$ 1.500",
    dailyPrice: "R$ 500",
    deposit: "R$ 5.000",
    available: true,
  },
];

export const CarsCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      align: "start",
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const handleWhatsApp = () => {
    const text = encodeURIComponent("Olá, Gostaria de mais informações sobre o carro dos site.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  return (
    <section id="carros" className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Carros Disponíveis
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Escolha o veículo ideal para você começar a trabalhar
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {cars.map((car, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] xl:flex-[0_0_25%]"
                >
                   <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 relative">
                    <CardContent className="p-4">
                      <div className="absolute top-4 right-4 z-10">
                        <Badge 
                          variant={car.available ? "default" : "secondary"}
                          className={car.available ? "bg-green-600 hover:bg-green-700" : "bg-gray-500 hover:bg-gray-600"}
                        >
                          {car.available ? "Disponível" : "Indisponível"}
                        </Badge>
                      </div>
                      <div className="aspect-[4/3] rounded-lg overflow-hidden mb-4 bg-white">
                        <img
                          src={car.image}
                          alt={`${car.name} ${car.year}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <h3 className="font-semibold text-lg mb-1">
                        {car.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Ano {car.year}
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Semana
                          </span>
                          <span className="font-bold text-primary">
                            {car.weeklyPrice}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Diária
                          </span>
                          <span className="font-semibold text-primary">
                            {car.dailyPrice}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Caução
                          </span>
                          <span className="font-semibold">{car.deposit}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button
                        onClick={handleWhatsApp}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Quero este carro
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur hidden md:flex"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur hidden md:flex"
            onClick={scrollNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
