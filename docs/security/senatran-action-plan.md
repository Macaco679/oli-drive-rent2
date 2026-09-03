# Plano de acao Senatran - OLI

Atualizado em 02/09/2026.

## Resolvido no codigo

- O frontend de pagamento com cartao usa tokenizacao antes de chamar o n8n.
- A Edge Function `asaas-tokenize-card` esta versionada em `supabase/functions/asaas-tokenize-card`.
- `asaas-tokenize-card` esta declarada em `supabase/config.toml` com `verify_jwt = true`.
- `webhook-proxy` nao aceita mais JSON sem `_webhook_target`.
- `webhook-proxy` deixou de registrar payload e resposta completa do n8n. Os logs agora registram destino, status, tamanho de resposta e payload redigido.
- Validacao facial passa pelo `webhook-proxy`; a URL do n8n nao fica mais chamada diretamente pelo browser.

## Acoes externas ainda obrigatorias

1. Publicar a Edge Function `asaas-tokenize-card` no Supabase.
2. Configurar o secret `ASAAS_API_KEY` ou `ASAAS_CAUCAO_API_KEY` no Supabase.
3. Confirmar com a Asaas que tokenizacao em producao esta habilitada para a conta usada.
4. Testar um pagamento real/controlado com cartao e guardar evidencia de que o n8n recebeu apenas token.
5. Rotacionar a chave SERPRO no gov.br.
6. Mover a chave SERPRO para credencial/variavel segura no n8n e remover qualquer valor hardcoded dos workflows.
7. Verificar no painel do Supabase se backups/PITR estao ativos e registrar ultimo backup/restauracao disponivel.
8. Formalizar a decisao de segregacao de ambientes: aceitar risco do n8n compartilhado ou criar ambiente separado.
9. Exportar os workflows n8n criticos sem credenciais e guardar como evidencia de configuracao.

## Evidencias recomendadas

- Print do Supabase mostrando `asaas-tokenize-card` publicada.
- Print dos secrets Supabase mostrando nomes dos secrets, sem valores.
- Print ou log redigido do pagamento mostrando `creditCardToken` e ausencia de numero/CVV no n8n.
- Print do painel Asaas ou e-mail do gerente confirmando tokenizacao em producao.
- Registro da rotacao SERPRO, com data, responsavel e workflow atualizado.
- Print de backup/PITR do Supabase.
- Export dos workflows n8n com credenciais mascaradas.
- Registro de revisao de acessos e MFA.

## Status das perguntas criticas

- Q6: resolvida, conforme teste de MFA ja registrado.
- Q10: codigo preparado; depende de publicacao da function, secret Asaas e confirmacao de habilitacao em producao.
- Q12: parcialmente defensavel para dados, mas pendente em automacao/ambiente por uso de n8n compartilhado e ausencia de staging.
- Q19: logs do proxy tratados no codigo; ainda depende de rotacao SERPRO e confirmacao dos logs/configuracoes no n8n.
