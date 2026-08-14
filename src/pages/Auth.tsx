import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp, signInWithGoogle, getCurrentUser } from "@/lib/supabase";
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

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    setGoogleLoading(false);

    if (error) {
      toast.error("Erro ao entrar com Google: " + error.message);
      return;
    }

    // O popup já persistiu a sessão no localStorage (mesma origem) antes de
    // fechar. Confirma que a sessão existe antes de navegar.
    const { session } = await getCurrentUser();
    if (session) {
      await ensureProfile();
      toast.success("Login realizado com sucesso!");
      navigate("/home");
    } else {
      toast.error("Login com Google não foi concluído. Tente novamente.");
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
    <div className="flex h-[100dvh] max-h-[100dvh] overflow-hidden">
      {/* Left side - Branding */}
      <div className="relative hidden h-full lg:flex lg:w-1/2 items-center justify-center overflow-hidden bg-[#050807]">
        <video
          className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-45 blur-2xl saturate-75"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden="true"
        >
          <source src="/videos/oli-login.mp4" type="video/mp4" />
        </video>
        <video
          className="pointer-events-none relative z-[1] h-full w-full object-contain"
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
          <source src="/videos/oli-login.mp4" type="video/mp4" />
          <img src="/videos/oli-login.gif" alt="" />
        </video>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-10 pb-10 pt-24 text-left text-white [background:linear-gradient(to_top,rgba(0,0,0,.78),rgba(0,0,0,.34)_58%,transparent)]">
          <h1 className="text-5xl font-bold mb-3 drop-shadow-lg">OLI</h1>
          <p className="text-xl mb-2 drop-shadow-md">Aluguel de carros entre particulares</p>
          <p className="max-w-lg text-white/85 text-base leading-relaxed drop-shadow-md">
            Conectando motoristas e proprietários de veículos. 
            Planos semanais e diários para motoristas de app e uso comum.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex h-full w-full items-center justify-center overflow-y-auto bg-background px-6 py-4 lg:w-1/2">
        <div className="w-full max-w-md space-y-4">
          {/* Mobile branding */}
          <div className="lg:hidden text-center">
            <h1 className="text-4xl font-bold text-primary mb-2">OLI</h1>
            <p className="text-muted-foreground">Aluguel de carros entre particulares</p>
          </div>


          <div className="bg-card p-6 rounded-2xl shadow-xl border border-border">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              {isLogin ? "Entrar" : "Criar conta"}
            </h2>

            {/* Google Sign In Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              className="w-full h-12 text-base font-medium gap-3 border-2 hover:bg-muted/50"
            >
              {googleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              Continuar com Google
            </Button>

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
                disabled={loading}
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
