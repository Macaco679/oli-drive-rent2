import { useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { BRAZILIAN_CITIES } from "@/lib/brazilianCities";

interface CityAutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Campo de texto com sugestões de cidades brasileiras enquanto o usuário
 * digita. Continua sendo um input de texto livre (não obriga escolher da
 * lista) — só ajuda a preencher mais rápido.
 */
export function CityAutocompleteInput({
  value,
  onChange,
  placeholder = "Cidade ou região de retirada",
  className,
}: CityAutocompleteInputProps) {
  const [open, setOpen] = useState(false);

  const suggestions = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (query.length < 2) return [];
    return BRAZILIAN_CITIES.filter((city) => city.toLowerCase().includes(query)).slice(0, 6);
  }, [value]);

  return (
    <Popover open={open && suggestions.length > 0} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className={className}
          autoComplete="off"
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
