import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import onixAzul from "@/assets/vehicles/onix-azul-2022.jpeg";
import hb20Prata from "@/assets/vehicles/hb20-prata-2024.png";
import argo2026 from "@/assets/vehicles/argo-2026.jpeg";
import basaltBranco from "@/assets/vehicles/basalt-branco-2024.jpeg";
import kicksPreto from "@/assets/vehicles/kicks-preto-2024.png";
import kicksPrata from "@/assets/vehicles/kicks-prata-2024.png";
import onixPrata from "@/assets/vehicles/onix-prata-2019.jpeg";
import prismaPreto from "@/assets/vehicles/prisma-preto-2019.jpeg";

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

function staticCoverForVehicle(id: string, title?: string, brand?: string, model?: string, year?: number) {
  const text = `${id} ${title || ""} ${brand || ""} ${model || ""} ${year || ""}`.toLowerCase();
  if (id === "static-1" || (text.includes("onix") && text.includes("2022"))) return onixAzul;
  if (id === "static-2" || text.includes("hb20")) return hb20Prata;
  if (id === "static-3" || text.includes("argo")) return argo2026;
  if (id === "static-4" || text.includes("basalt")) return basaltBranco;
  if (id === "static-5" || (text.includes("kicks") && !text.includes("prata"))) return kicksPreto;
  if (id === "static-6" || (text.includes("kicks") && text.includes("prata"))) return kicksPrata;
  if (id === "static-7" || (text.includes("onix") && text.includes("2019"))) return onixPrata;
  if (id === "static-8" || text.includes("prisma")) return prismaPreto;
  return undefined;
}

function shouldPreferLocalCover(url?: string) {
  return Boolean(url && url.includes("supabase.co/storage/v1/object/public/vehicle-photos/"));
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
  const fallbackCover = staticCoverForVehicle(id, title, brand, model, year);
  const [resolvedCover, setResolvedCover] = useState<string | undefined>(
    shouldPreferLocalCover(coverImage) ? fallbackCover : coverImage || fallbackCover
  );
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
      className="card-elevated overflow-hidden cursor-pointer hover:shadow-[var(--shadow-elevated)] transition-shadow"
    >
      <div className="relative h-48 bg-muted">
        {resolvedCover ? (
          <img
            src={resolvedCover}
            alt={vehicleTitle}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={tryFallbackFromStorage}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Sem foto
          </div>
        )}
        <Badge
          className="absolute top-3 right-3"
          variant={status === "available" && isActive ? "default" : "secondary"}
        >
          {status === "available" && isActive ? "Disponível" : "Indisponível"}
        </Badge>
      </div>
      
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-lg text-foreground">{vehicleTitle}</h3>
        
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          {weeklyPrice && (
            <div className="text-sm">
              <span className="text-muted-foreground">Semanal:</span>
              <span className="font-semibold text-primary ml-1">
                R$ {weeklyPrice.toLocaleString('pt-BR')}
              </span>
            </div>
          )}
          {dailyPrice && (
            <div className="text-sm">
              <span className="text-muted-foreground">Diária:</span>
              <span className="font-semibold text-primary ml-1">
                R$ {dailyPrice.toLocaleString('pt-BR')}
              </span>
            </div>
          )}
        </div>
        
        <button className="w-full btn-pill bg-primary text-primary-foreground hover:bg-primary/90 text-sm mt-2">
          Ver detalhes
        </button>
      </div>
    </div>
  );
};
