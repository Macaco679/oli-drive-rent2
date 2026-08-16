import { useEffect, useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { BRAZILIAN_CITIES } from "@/lib/brazilianCities";
import { isPostalCodeComplete, lookupAddressByPostalCode, sanitizePostalCode } from "@/lib/addressService";

interface CityAutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Campo de localização sem navegação automática.
 * Sugere cidades brasileiras durante a digitação e, quando recebe um CEP
 * completo, resolve o CEP e preenche cidade/UF no próprio campo.
 */
export function CityAutocompleteInput({
  value,
  onChange,
  placeholder = "Cidade, região ou CEP de retirada",
  className,
}: CityAutocompleteInputProps) {
  const [open, setOpen] = useState(false);
  const [resolvingPostalCode, setResolvingPostalCode] = useState(false);

  const suggestions = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (query.length < 2 || /^\d[\d-]*$/.test(query)) return [];
    return BRAZILIAN_CITIES.filter((city) => city.toLowerCase().includes(query)).slice(0, 6);
  }, [value]);

  useEffect(() => {
    if (!isPostalCodeComplete(value)) return;

    const postalCode = sanitizePostalCode(value);
    let cancelled = false;

    const resolvePostalCode = async () => {
      try {
        setResolvingPostalCode(true);
        const address = await lookupAddressByPostalCode(postalCode);
        if (!cancelled && address.city && address.state) {
          onChange(`${address.city} - ${address.state}`);
          setOpen(false);
        }
      } catch {
        // Mantém o valor digitado para o usuário corrigir; não navega nem abre outra página.
      } finally {
        if (!cancelled) setResolvingPostalCode(false);
      }
    };

    void resolvePostalCode();
    return () => {
      cancelled = true;
    };
  }, [value, onChange]);

  return (
    <Popover open={open && suggestions.length > 0} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Input
          placeholder={resolvingPostalCode ? "Consultando CEP..." : placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className={className}
          autoComplete="off"
          inputMode={/^\d[\d-]*$/.test(value) ? "numeric" : "text"}
        />
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command>
          <CommandList>
            <CommandGroup>
              {suggestions.map((city) => (
                <CommandItem
                  key={city}
                  value={city}
                  onSelect={() => {
                    onChange(city);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  {city}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
