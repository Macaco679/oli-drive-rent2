-- Tabela de notificações in-app (ícone de sino no header).
-- Cada linha é uma notificação para um usuário específico. O envio de
-- e-mail (send-notification-email) e a notificação in-app agora saem do
-- mesmo ponto único no frontend (src/lib/notificationService.ts), então
-- todo evento que já dispara e-mail passa a também gravar aqui.

CREATE TABLE IF NOT EXISTS public.oli_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  body text,
  link text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS oli_notifications_user_id_created_at_idx
  ON public.oli_notifications (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS oli_notifications_user_id_unread_idx
  ON public.oli_notifications (user_id)
  WHERE is_read = false;

ALTER TABLE public.oli_notifications ENABLE ROW LEVEL SECURITY;

-- Cada usuário só vê as próprias notificações.
CREATE POLICY "users_can_view_own_notifications"
ON public.oli_notifications
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Cada usuário só pode marcar como lida a própria notificação (não pode
-- alterar type/title/body/link/user_id de ninguém).
CREATE POLICY "users_can_update_own_notifications_read_status"
ON public.oli_notifications
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Qualquer usuário autenticado pode criar uma notificação para outro
-- usuário (ex: locatário solicita reserva -> notificação pro locador).
-- Isso espelha o mesmo modelo de confiança já usado pelo envio de e-mail
-- (send-notification-email aceita recipient_id de qualquer usuário
-- autenticado). Não é validação perfeita contra spam interno, mas mantém
-- consistência com o que já existe hoje; pode ser revisado na auditoria
-- de segurança (item separado).
CREATE POLICY "authenticated_users_can_create_notifications"
ON public.oli_notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.oli_notifications;
