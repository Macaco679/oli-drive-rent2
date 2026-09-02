# Roadmap

## Tarefas em andamento
- [x] Remover filtro `owner_id` de `getVehicleById` em `src/lib/vehicleService.ts`
- [ ] Corrigir erros de typecheck que impedem o build do preview
  - [ ] `src/pages/Search.tsx` — interface `VehicleWithCover` incompatível com `OliVehicle`
  - [ ] `src/pages/SecuritySettings.tsx` — tipo `VerifiedFactor` incompatível com retorno do Supabase MFA
