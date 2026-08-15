import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { WebLayout } from "@/components/layout/WebLayout";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { CityAutocompleteInput } from "@/components/vehicles/CityAutocompleteInput";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getAvailableVehicles, getVehicleCoverPhoto, OliVehicle } from "@/lib/supabase";
import { MapPin, Search as SearchIcon, SlidersHorizontal } from "lucide-react";

interface VehicleWithCover extends OliVehicle {
  coverImage?: string;
  pickup_neighborhood?: string | null;
}

type FilterId = "automatic" | "economy" | "suv" | "popular";

const normalizeSearchValue = (value: string | null | undefined) =>
  (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

export default function Search() {
  const location = useLocation();
  const [vehicles, setVehicles] = useState<VehicleWithCover[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleWithCover[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [activeFilters, setActiveFilters] = useState<Set<FilterId>>(new Set());

  useEffect(() => {
    loadVehicles();

    const routeState = location.state as
      | { selectedType?: string; searchCar?: string; searchCity?: string }
      | null;

    if (routeState?.selectedType) {
      const typeMap: Record<string, FilterId> = {
        automatic: "automatic",
        economico: "economy",
        suv: "suv",
        popular: "popular",
      };
      const mappedFilter = typeMap[routeState.selectedType];
      if (mappedFilter) {
        setActiveFilters(new Set([mappedFilter]));
      }
    }

    setSearchText(routeState?.searchCar || "");
    setSearchCity(routeState?.searchCity || "");
  }, [location.state]);

  useEffect(() => {
    applyFilters();
  }, [vehicles, searchText, searchCity, activeFilters]);

  const loadVehicles = async () => {
    setLoading(true);

    try {
      const allVehicles = await getAvailableVehicles();
      const vehiclesWithCovers = await Promise.all(
        allVehicles.map(async (vehicle) => {
          const coverImage = await getVehicleCoverPhoto(vehicle.id);
          return { ...vehicle, coverImage: coverImage || undefined };
        })
      );

      setVehicles(vehiclesWithCovers);
    } catch (error) {
      console.error("Erro ao carregar veículos para busca", error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...vehicles];

    if (searchText) {
      const search = normalizeSearchValue(searchText);
      filtered = filtered.filter(
        (vehicle) =>
          normalizeSearchValue(vehicle.title).includes(search) ||
          normalizeSearchValue(vehicle.brand).includes(search) ||
          normalizeSearchValue(vehicle.model).includes(search) ||
          vehicle.year?.toString().includes(search) ||
          normalizeSearchValue(vehicle.location_city).includes(search) ||
          normalizeSearchValue(vehicle.pickup_neighborhood).includes(search)
      );
    }

    // A Home envia a cidade separadamente. O valor era ignorado antes e a
    // página acabava exibindo todos os veículos independentemente do local.
    if (searchCity) {
      const [cityPart, statePart] = searchCity.split(/\s+-\s+/, 2);
      const cityQuery = normalizeSearchValue(cityPart);
      const stateQuery = normalizeSearchValue(statePart);

      filtered = filtered.filter((vehicle) => {
        const city = normalizeSearchValue(vehicle.location_city);
        const state = normalizeSearchValue(vehicle.location_state);
        const neighborhood = normalizeSearchValue(vehicle.pickup_neighborhood);
        const matchesCity = city.includes(cityQuery) || neighborhood.includes(cityQuery);
        const matchesState = !stateQuery || state === stateQuery;

        return matchesCity && matchesState;
      });
    }

    if (activeFilters.has("automatic")) {
      filtered = filtered.filter((vehicle) => vehicle.transmission === "automatic");
    }
    if (activeFilters.has("economy")) {
      filtered = filtered.filter((vehicle) => vehicle.segment === "economy");
    }
    if (activeFilters.has("suv")) {
      filtered = filtered.filter((vehicle) => vehicle.body_type === "suv");
    }
    if (activeFilters.has("popular")) {
      filtered = filtered.filter((vehicle) => vehicle.is_popular === true);
    }

    setFilteredVehicles(filtered);
  };

  const toggleFilter = (filterId: FilterId) => {
    setActiveFilters((previousFilters) => {
      const nextFilters = new Set(previousFilters);
      if (nextFilters.has(filterId)) {
        nextFilters.delete(filterId);
      } else {
        nextFilters.add(filterId);
      }
      return nextFilters;
    });
  };

  const filters: { id: FilterId; label: string }[] = [
    { id: "automatic", label: "Automático" },
    { id: "economy", label: "Econômico" },
    { id: "suv", label: "SUV" },
    { id: "popular", label: "Popular" },
  ];

  return (
    <WebLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Buscar veículos</h1>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Modelo, marca ou ano"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  className="pl-10 h-12"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-5 h-5 text-muted-foreground" />
                <CityAutocompleteInput
                  value={searchCity}
                  onChange={setSearchCity}
                  placeholder="Cidade ou região de retirada"
                  className="pl-10 h-12"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                className="p-3 border border-border rounded-lg hover:bg-secondary transition-colors"
                aria-label="Filtros de busca"
              >
                <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
              </button>
              {filters.map((filter) => (
                <Badge
                  key={filter.id}
                  variant={activeFilters.has(filter.id) ? "default" : "outline"}
                  className="cursor-pointer h-10 px-4"
                  onClick={() => toggleFilter(filter.id)}
                >
                  {filter.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="min-h-[34rem]">
          <p className="text-muted-foreground mb-6">
            {loading
              ? "Buscando veículos..."
              : `${filteredVehicles.length} veículo${filteredVehicles.length !== 1 ? "s" : ""} encontrado${filteredVehicles.length !== 1 ? "s" : ""}`}
          </p>

          {loading ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              aria-label="Carregando veículos"
            >
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="h-[25rem] rounded-2xl bg-muted/60 animate-pulse" />
              ))}
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-2">Nenhum veículo encontrado</p>
              <p className="text-sm text-muted-foreground">Tente ajustar seus filtros de busca</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  id={vehicle.id}
                  title={vehicle.title || undefined}
                  brand={vehicle.brand || undefined}
                  model={vehicle.model || undefined}
                  year={vehicle.year || undefined}
                  coverImage={vehicle.coverImage}
                  dailyPrice={vehicle.daily_price || undefined}
                  weeklyPrice={vehicle.weekly_price || undefined}
                  locationCity={vehicle.location_city || undefined}
                  locationState={vehicle.location_state || undefined}
                  status={vehicle.status}
                  isActive={vehicle.is_active}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </WebLayout>
  );
}
