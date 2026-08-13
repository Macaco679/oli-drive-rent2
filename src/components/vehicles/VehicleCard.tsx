import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface VehicleCardProps {
  id: string;
  title?: string;
  brand?: string;
  model?: string;
  year?: number;
  coverImage?: string;
  dailyPrice?: number;
  weeklyPrice?: number;
  locationCity?: string;
  locationState?: string;
  status: string;
  isActive: boolean;
}

export const VehicleCard = ({
  id,
  title,
  brand,
  model,
  year,
  coverImage,
  dailyPrice,
  weeklyPrice,
  locationCity,
  locationState,
  status,
  isActive,
}: VehicleCardProps) => {
  const navigate = useNavigate();
  const [resolvedCover, setResolvedCover] = useState<string | undefined>(coverImage);
  const [attemptedFallback, setAttemptedFallback] = useState(false);

  const vehicleTitle = title || `${brand || ""} ${model || ""} ${year || ""}`.trim() || "Veículo sem nome";
  const location = locationCity && locationState ? `${locationCity} - ${locationState}` : "Localização não informada";

  const tryFallbackFromStorage = async () => {
    if (attemptedFallback) return;
    setAttemptedFallback(true);
    try {
      const { data: files, error } = await supabase.storage
        .from("vehicle-photos")
        .list(id, { limit: 1, sortBy: { column: "created_at", order: "desc" } });

      if (error || !files || files.length === 0) {
        setResolvedCover(undefined);
        return;
      }

      const file = files.find((f) => !!f.name && !f.name.endsWith("/"));
      if (!file?.name) {
        setResolvedCover(undefined);
        return;
      }

      const { data } = supabase.storage
        .from("vehicle-photos")
        .getPublicUrl(`${id}/${file.name}`);

      setResolvedCover(data.publicUrl || undefined);
    } catch {
      setResolvedCover(undefined);
    }
  };

  return (
    <div
      onClick={() => navigate(`/vehicle/${id}`)}
      className="group relative h-full overflow-hidden rounded-[1.35rem] border border-primary/15 bg-card cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_22px_48px_rgba(11,77,70,0.14)]"
    >
      <div className="pointer-events-none absolute inset-x-6 top-0 z-20 h-px bg-gradient-to-r from-transparent via-emerald-400/75 to-transparent" />

      <div className="relative h-48 bg-muted overflow-hidden">
        {resolvedCover ? (
          <img
            src={resolvedCover}
            alt={vehicleTitle}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
            loading="lazy"
            onError={tryFallbackFromStorage}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Sem foto
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent" />
        <Badge
          className="absolute top-3 right-3 rounded-full border border-white/25 bg-white/90 text-primary shadow-sm backdrop-blur hover:bg-white"
          variant="secondary"
        >
          <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${status === "available" && isActive ? "bg-emerald-500" : "bg-muted-foreground"}`} />
          {status === "available" && isActive ? "Disponível" : "Indisponível"}
        </Badge>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-semibold text-lg text-foreground leading-snug">{vehicleTitle}</h3>
          <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary/65" />
            <span>{location}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-primary/10 bg-primary/[0.035]">
          <div className="min-w-0 p-3 border-r border-primary/10">
            <span className="block text-[11px] uppercase tracking-[0.11em] text-muted-foreground">Semanal</span>
            <span className="mt-1 block truncate font-semibold text-primary">
              {weeklyPrice ? `R$ ${weeklyPrice.toLocaleString('pt-BR')}` : "—"}
            </span>
          </div>
          <div className="min-w-0 p-3">
            <span className="block text-[11px] uppercase tracking-[0.11em] text-muted-foreground">Diária</span>
            <span className="mt-1 block truncate font-semibold text-primary">
              {dailyPrice ? `R$ ${dailyPrice.toLocaleString('pt-BR')}` : "—"}
            </span>
          </div>
        </div>

        <button className="metal-button relative flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
          Ver detalhes
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </div>
  );
};
