import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WebLayout } from "@/components/layout/WebLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Smartphone,
  Copy,
  Check,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "@/lib/supabase";

type VerifiedFactor = {
  id: string;
  friendly_name?: string | null;
  created_at: string;
};

type EnrollData = {
  factorId: string;
  qrCode: string;
  secret: string;
};

export default function SecuritySettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [factors, setFactors] = useState<VerifiedFactor[]>([]);
  const [starting, setStarting] = useState(false);
  const [enrollData, setEnrollData] = useState<EnrollData | null>(null);
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [secretCopied, setSecretCopied] = useState(false);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    (async () => {
      const { user } = await getCurrentUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      await loadFactors();
      setLoading(false);
    })();
  }, [navigate]);

  const loadFactors = async () => {
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (error) {
      toast.error("Erro ao carregar fatores de autenticação: " + error.message);
      return;
    }
    const verified = (data?.totp || []).filter((f) => f.status === "verified");
    setFactors(verified);
  };

  const startEnroll = async () => {
    setStarting(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: `Autenticador ${new Date().toLocaleDateString("pt-BR")}`,
      });

      if (error || !data) {
        toast.error("Erro ao iniciar ativação: " + (error?.message || "tente novamente"));
        return;
      }

      setEnrollData({
        factorId: data.id,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
      });
      setCode("");
    } finally {
      setStarting(false);
    }
  };

  const cancelEnroll = async () => {
    if (enrollData) {
      await supabase.auth.mfa.unenroll({ factorId: enrollData.factorId });
    }
    setEnrollData(null);
    setCode("");
  };

  const verifyEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollData) return;

    const trimmedCode = code.trim();
    if (trimmedCode.length !== 6) {
      toast.error("Digite o código de 6 dígitos do seu aplicativo autenticador");
      return;
    }

    setVerifying(true);
    try {
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: enrollData.factorId,
      });

      if (challengeError || !challenge) {
        toast.error("Erro ao gerar verificação: " + (challengeError?.message || "tente novamente"));
        return;
      }

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: enrollData.factorId,
        challengeId: challenge.id,
        code: trimmedCode,
      });

      if (verifyError) {
        toast.error("Código inválido. Confira o app autenticador e tente novamente.");
        return;
      }

      toast.success("Autenticação de dois fatores ativada!");
      setEnrollData(null);
      setCode("");
      await loadFactors();
    } finally {
      setVerifying(false);
    }
  };

  const copySecret = async () => {
    if (!enrollData) return;
    try {
      await navigator.clipboard.writeText(enrollData.secret);
      setSecretCopied(true);
      setTimeout(() => setSecretCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar. Selecione o código manualmente.");
    }
  };

  const removeFactor = async (factorId: string) => {
    setRemoving(true);
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId });
      if (error) {
        toast.error("Erro ao remover: " + error.message);
        return;
      }
      toast.success("Autenticação de dois fatores removida");
      setConfirmRemoveId(null);
      await loadFactors();
    } finally {
      setRemoving(false);
    }
  };

  if (loading) {
    return (
      <WebLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </WebLayout>
    );
  }

  const hasFactor = factors.length > 0;

  return (
    <WebLayout>
      <div className="platform-page-frame">
        <div className="platform-page-banner max-w-3xl mx-auto mb-6">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-7 h-7" />
                <h1 className="text-xl font-bold">Segurança da conta</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-6 pb-24 space-y-6">
          {hasFactor ? (
            <Alert className="border-primary/50 bg-primary/5 text-primary">
              <ShieldCheck className="h-4 w-4" />
              <AlertDescription>
                <strong>Autenticação de dois fatores ativada.</strong> Sua conta pede um código do
                seu aplicativo autenticador a cada novo login.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                <strong>Autenticação de dois fatores desativada.</strong> Ative para proteger sua
                conta mesmo que sua senha seja descoberta.
              </AlertDescription>
            </Alert>
          )}

          <Card className="shadow-md border-0">
            <CardHeader className="bg-primary/5 rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Aplicativo autenticador (TOTP)
              </CardTitle>
              <CardDescription>
                Use um app como Google Authenticator, Microsoft Authenticator ou Authy para gerar
                códigos de acesso.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {hasFactor &&
                factors.map((factor) => (
                  <div
                    key={factor.id}
                    className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border bg-secondary/30"
                  >
                    <div>
                      <p className="font-medium">
                        {factor.friendly_name || "Aplicativo autenticador"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Ativado em {new Date(factor.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>

                    {confirmRemoveId === factor.id ? (
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setConfirmRemoveId(null)}
                          disabled={removing}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFactor(factor.id)}
                          disabled={removing}
                        >
                          {removing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmar remoção"}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setConfirmRemoveId(factor.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}

              {!hasFactor && !enrollData && (
                <Button onClick={startEnroll} disabled={starting} className="w-full h-12">
                  {starting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 mr-2" />
                  )}
                  Ativar autenticação de dois fatores
                </Button>
              )}

              {enrollData && (
                <form onSubmit={verifyEnroll} className="space-y-4">
                  <div className="flex flex-col items-center gap-3 py-2">
                    <img
                      src={enrollData.qrCode}
                      alt="QR code para configurar o aplicativo autenticador"
                      className="w-48 h-48 rounded-lg border border-border bg-white p-2"
                    />
                    <p className="text-sm text-muted-foreground text-center">
                      Escaneie o QR code com seu aplicativo autenticador, ou digite o código manualmente:
                    </p>
                    <button
                      type="button"
                      onClick={copySecret}
                      className="flex items-center gap-2 text-sm font-mono bg-secondary px-3 py-2 rounded-md hover:bg-secondary/70 transition-colors break-all text-center"
                    >
                      {secretCopied ? (
                        <Check className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <Copy className="w-4 h-4 flex-shrink-0" />
                      )}
                      {enrollData.secret}
                    </button>
                  </div>

                  <div>
                    <Label htmlFor="mfa-code">Código de 6 dígitos</Label>
                    <Input
                      id="mfa-code"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                      className="mt-1 h-12 text-center text-lg tracking-[0.5em]"
                      placeholder="000000"
                      autoFocus
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 h-12"
                      onClick={cancelEnroll}
                      disabled={verifying}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="flex-1 h-12" disabled={verifying}>
                      {verifying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Confirmar
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </WebLayout>
  );
}
