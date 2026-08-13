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
  const isAvailable = status === "available" && isActive;

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
      className="vehicle-card-v4 group"
    >
      <div className="vehicle-card-v4__metal-line" aria-hidden="true" />

      <div className="vehicle-card-v4__media">
        {resolvedCover ? (
          <img
            src={resolvedCover}
            alt={vehicleTitle}
            className="vehicle-card-v4__image"
            loading="lazy"
            onError={tryFallbackFromStorage}
          />
        ) : (
          <div className="vehicle-card-v4__empty">Sem foto</div>
        )}

        <Badge className="vehicle-card-v4__badge" variant="secondary">
          <span className={`vehicle-card-v4__status-dot ${isAvailable ? "is-available" : ""}`} />
          {isAvailable ? "Disponível" : "Indisponível"}
        </Badge>
      </div>

      <div className="vehicle-card-v4__body">
        <div className="vehicle-card-v4__summary">
          <h3 className="vehicle-card-v4__title">{vehicleTitle}</h3>
          <div className="vehicle-card-v4__location">
            <MapPin />
            <span>{location}</span>
          </div>
        </div>

        <div className="vehicle-card-v4__rates">
          <div className="vehicle-card-v4__rate">
            <span className="vehicle-card-v4__rate-label">Semanal</span>
            <span className="vehicle-card-v4__rate-value">
              {weeklyPrice != null ? `R$ ${weeklyPrice.toLocaleString("pt-BR")}` : "—"}
            </span>
          </div>
          <div className="vehicle-card-v4__rate">
            <span className="vehicle-card-v4__rate-label">Diária</span>
            <span className="vehicle-card-v4__rate-value">
              {dailyPrice != null ? `R$ ${dailyPrice.toLocaleString("pt-BR")}` : "—"}
            </span>
          </div>
        </div>

        <button type="button" className="vehicle-card-v4__cta">
          <span>Ver detalhes</span>
          <ArrowUpRight />
        </button>
      </div>
    </div>
  );
};
