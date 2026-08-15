import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "@/lib/supabase";
import { supabase } from "@/integrations/supabase/client";
import { ensureProfile } from "@/lib/ensureProfile";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    if (loading || googleLoading) return;

    setGoogleLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: "select_account",
          },
        },
      });

      if (error) {
        toast.error("Erro ao entrar com Google: " + error.message);
        setGoogleLoading(false);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro inesperado no login com Google.";
      toast.error("Erro ao entrar com Google: " + message);
      setGoogleLoading(false);
    }
  };

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

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={loading || googleLoading}
              className="h-11 w-full gap-3 bg-background text-foreground hover:bg-muted"
            >
              {googleLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z" />
                  <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.63-2.36l-3.24-2.54c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.62A10 10 0 0 0 12 22Z" />
                  <path fill="#FBBC05" d="M6.39 13.93A6.02 6.02 0 0 1 6.07 12c0-.67.11-1.32.32-1.93V7.45H3.04A10 10 0 0 0 2 12c0 1.61.38 3.14 1.04 4.55l3.35-2.62Z" />
                  <path fill="#EA4335" d="M12 5.94c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.64 9.64 0 0 0 12 2 10 10 0 0 0 3.04 7.45l3.35 2.62C7.18 7.7 9.39 5.94 12 5.94Z" />
                </svg>
              )}
              <span>{googleLoading ? "Abrindo Google..." : "Continuar com o Google"}</span>
            </Button>

            {/* Divider */}
            <div className="relative my-4">
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
