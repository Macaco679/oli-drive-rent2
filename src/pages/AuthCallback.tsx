import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ensureProfile } from "@/lib/ensureProfile";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, RefreshCw } from "lucide-react";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Quando o login é feito via popup (Google), esta página roda dentro do
  // popup, não na aba principal. Nesse caso não navegamos — só garantimos
  // que a sessão foi persistida e fechamos a janela; quem estava esperando
  // na aba principal (signInWithGoogle) detecta o fechamento e segue o fluxo.
  const isPopup = typeof window !== "undefined" && !!window.opener;

  const finish = async () => {
    await ensureProfile();
    if (isPopup) {
      window.close();
    } else {
      navigate("/home", { replace: true });
    }
  };

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Aguarda a sessão ser estabelecida pelo Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Erro na sessão:", sessionError);
          setError(sessionError.message);
          setLoading(false);
          return;
        }

        if (session) {
          await finish();
        } else {
          // Sem sessão - tentar escutar mudanças de auth
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "SIGNED_IN" && session) {
              subscription.unsubscribe();
              await finish();
            }
          });

          // Timeout para evitar espera infinita
          setTimeout(() => {
            subscription.unsubscribe();
            if (isPopup) {
              // Se travou dentro do popup, fecha para não deixar o usuário
              // preso numa janela órfã; a aba principal mostra o erro dela.
              window.close();
            } else {
              setError("Tempo limite excedido. Por favor, tente novamente.");
              setLoading(false);
            }
          }, 10000);
        }
      } catch (err) {
        console.error("Erro no callback:", err);
        if (isPopup) {
          window.close();
        } else {
          setError("Erro ao processar login. Tente novamente.");
          setLoading(false);
        }
      }
    };

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  if (error) {
    return (
      <div className="platform-standalone min-h-screen flex items-center justify-center p-4">
        <div className="platform-standalone-card bg-card p-8 rounded-2xl shadow-xl border border-border max-w-md w-full text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Erro no login</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate("/auth")}
            >
              Voltar
            </Button>
            <Button
              onClick={() => window.location.reload()}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="platform-standalone min-h-screen flex items-center justify-center p-4">
      <div className="platform-standalone-card text-center px-10 py-9">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Finalizando login...</p>
      </div>
    </div>
  );
}
