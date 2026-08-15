import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "@/lib/supabase";
import { supabase } from "@/integrations/supabase/client";
import { ensureProfile } from "@/lib/ensureProfile";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "782627582997-i394igrd61r7ca34ne1tugvkh49dsp04.apps.googleusercontent.com";

type GoogleCredentialResponse = {
  credential?: string;
};

type GoogleIdConfiguration = {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  ux_mode?: "popup" | "redirect";
  auto_select?: boolean;
  use_fedcm_for_prompt?: boolean;
};

type GoogleButtonConfiguration = {
  type?: "standard" | "icon";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  shape?: "rectangular" | "pill" | "circle" | "square";
  logo_alignment?: "left" | "center";
  width?: number;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleIdConfiguration) => void;
          renderButton: (parent: HTMLElement, config: GoogleButtonConfiguration) => void;
        };
      };
    };
  }
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleGoogleCredential = useCallback(
    async (response: GoogleCredentialResponse) => {
      if (!response.credential) {
        toast.error("O Google não retornou uma credencial válida. Tente novamente.");
        return;
      }

      setGoogleLoading(true);

      try {
        // Login direto com o Google Identity Services. O navegador não é
        // redirecionado para *.supabase.co: o Google entrega um ID token e
        // o Supabase apenas valida esse token em segundo plano.
        const { error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: response.credential,
        });

        if (error) {
          toast.error("Erro ao entrar com Google: " + error.message);
          return;
        }

        await ensureProfile();
        toast.success("Login realizado com sucesso!");
        navigate("/home");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Erro inesperado no login com Google.";
        toast.error("Erro ao entrar com Google: " + message);
      } finally {
        setGoogleLoading(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    let disposed = false;

    const renderGoogleButton = () => {
      if (disposed || !window.google?.accounts?.id || !googleButtonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
        ux_mode: "popup",
        auto_select: false,
        use_fedcm_for_prompt: true,
      });

      googleButtonRef.current.replaceChildren();
      const width = Math.max(240, Math.min(400, googleButtonRef.current.clientWidth || 400));

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        logo_alignment: "left",
        width,
      });
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (window.google?.accounts?.id) {
      renderGoogleButton();
    } else if (existingScript) {
      existingScript.addEventListener("load", renderGoogleButton, { once: true });
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.addEventListener("load", renderGoogleButton, { once: true });
      script.addEventListener(
        "error",
        () => toast.error("Não foi possível carregar o login do Google. Tente novamente."),
        { once: true }
      );
      document.head.appendChild(script);
    }

    return () => {
      disposed = true;
      existingScript?.removeEventListener("load", renderGoogleButton);
    };
  }, [handleGoogleCredential]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { data, error } = await signIn(email, password);
      if (error) {
        toast.error("Erro ao entrar: " + error.message);
      } else if (data.user) {
        await ensureProfile(); // Sincroniza email no perfil
        toast.success("Login realizado com sucesso!");
        navigate("/home");
      }
    } else {
      if (!fullName.trim()) {
        toast.error("Por favor, informe seu nome completo");
        setLoading(false);
        return;
      }

      const { data, error } = await signUp(email, password, fullName);
      if (error) {
        toast.error("Erro ao criar conta: " + error.message);
      } else {
        await ensureProfile(); // Sincroniza email no perfil
        toast.success("Conta criada! Verifique seu e-mail para confirmar.");
        navigate("/onboarding");
      }
    }

    setLoading(false);
  };

  return (
    <div className="platform-standalone auth-viewport flex">
      {/* Left side - Branding */}
      <div className="relative hidden h-full lg:flex lg:w-1/2 items-center justify-center overflow-hidden bg-[#050807]">
        <video
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload noplaybackrate noremoteplayback"
          aria-hidden="true"
        >
          <source src="/videos/oli-login-untitled12-original.mp4" type="video/mp4" />
          <img src="/videos/oli-login.gif" alt="" />
        </video>
      </div>

      {/* Right side - Form */}
      <div className="flex h-full w-full items-center justify-center overflow-y-auto bg-transparent px-6 py-4 lg:w-1/2">
        <div className="w-full max-w-md space-y-4">
          {/* Mobile branding */}
          <div className="lg:hidden text-center">
            <h1 className="text-4xl font-bold text-primary mb-2">OLI</h1>
            <p className="text-muted-foreground">Aluguel de carros entre particulares</p>
          </div>

          <div className="platform-standalone-card bg-card p-6 rounded-2xl shadow-xl border border-border">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              {isLogin ? "Entrar" : "Criar conta"}
            </h2>

            {/* Google Identity Services - login direto, sem redirect do Supabase */}
            <div
              className={`relative flex min-h-11 w-full items-center justify-center overflow-hidden ${
                googleLoading || loading ? "pointer-events-none opacity-60" : ""
              }`}
            >
              <div ref={googleButtonRef} className="flex w-full justify-center" />
              {googleLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-card/80">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">ou</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <Label htmlFor="fullName">Nome completo</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={!isLogin}
                    className="mt-1 h-12"
                    placeholder="Seu nome completo"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 h-12"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="mt-1 h-12"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <Button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full h-12 text-lg"
              >
                {loading ? "Carregando..." : isLogin ? "Entrar" : "Criar conta"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:underline"
              >
                {isLogin
                  ? "Não tem conta? Criar conta"
                  : "Já tem conta? Entrar"}
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Ao criar sua conta, você concorda com nossos termos de uso e política de privacidade.
          </p>
        </div>
      </div>
    </div>
  );
}
