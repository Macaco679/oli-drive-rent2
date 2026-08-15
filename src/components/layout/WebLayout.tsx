import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Search, Calendar, MessageCircle, User, HelpCircle, LogIn, Car, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/supabase";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import "@/lib/persistentBackgroundVideos";

interface WebLayoutProps {
  children: ReactNode;
}

const publicNavItems = [
  { path: "/home", label: "Início", icon: Home },
  { path: "/search", label: "Buscar", icon: Search },
];

const authNavItems = [
  { path: "/home", label: "Início", icon: Home },
  { path: "/search", label: "Buscar", icon: Search },
  { path: "/my-vehicles", label: "Meus Veículos", icon: Car },
  { path: "/reservations", label: "Reservas", icon: Calendar },
  { path: "/messages", label: "Mensagens", icon: MessageCircle },
  { path: "/profile", label: "Perfil", icon: User },
];

const FOOTER_LIVE_WALLPAPER = "/videos/footer-untitled6-original.mp4";

export function WebLayout({ children }: WebLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomeRoute = location.pathname === "/home" || location.pathname === "/";
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { user } = await getCurrentUser();
      setIsAuthenticated(!!user);
    } catch {
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  const navItems = isAuthenticated ? authNavItems : publicNavItems;

  return (
    <div className="platform-shell min-h-screen min-w-0 overflow-x-clip bg-background flex flex-col">
      {/* Header */}
      <header className="metal-header sticky top-0 z-50 text-primary-foreground">
        <div className="site-shell">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link to="/home" className="flex items-center gap-2 shrink-0 group">
              <span className="text-2xl font-bold tracking-[-0.04em]">OLI</span>
              <span className="hidden lg:block h-1.5 w-1.5 rounded-full bg-emerald-200/80 shadow-[0_0_12px_rgba(167,243,208,0.7)]" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex min-w-0 items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.045] p-1 backdrop-blur-md">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl transition-all whitespace-nowrap",
                      isActive
                        ? "bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]"
                        : "text-white/70 hover:bg-white/[0.08] hover:text-white"
                    )}
                  >
                    <item.icon className="w-[18px] h-[18px]" />
                    <span className="font-medium text-sm lg:text-base">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {!loading && !isAuthenticated && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate("/auth")}
                  className="hidden md:flex items-center gap-2 rounded-xl border border-white/15 bg-white/90 text-primary hover:bg-white"
                >
                  <LogIn className="w-4 h-4" />
                  Entrar
                </Button>
              )}
              {!loading && isAuthenticated && (
                <NotificationBell triggerClassName="text-primary-foreground" />
              )}
              <button className="p-2 hover:bg-white/[0.09] rounded-xl transition-colors" aria-label="Ajuda">
                <HelpCircle className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden border-t border-white/10 bg-black/[0.04]">
          <div className="flex items-center justify-around py-2 px-2 overflow-x-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors shrink-0",
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:text-white"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
            {!loading && !isAuthenticated && (
              <Link
                to="/auth"
                className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors text-primary-foreground/60 hover:text-primary-foreground"
              >
                <LogIn className="w-5 h-5" />
                <span className="text-xs font-medium">Entrar</span>
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main
        className={cn(
          "platform-main flex-1 min-w-0",
          isHomeRoute ? "platform-main--home" : "platform-main--internal"
        )}
        data-route={location.pathname}
      >
        {children}
      </main>

      {/* Footer */}
      <footer className="site-live-footer relative isolate overflow-hidden border-t border-emerald-200/20 py-10 lg:py-12 mt-auto text-white">
        <video
          className="site-live-footer__backdrop absolute inset-0 z-0 h-full w-full"
          src={FOOTER_LIVE_WALLPAPER}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <video
          className="site-live-footer__video absolute left-1/2 top-0 z-[1] h-full w-auto max-w-none"
          src={FOOTER_LIVE_WALLPAPER}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="footer-video-overlay absolute inset-0 z-[2]" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 z-[3] h-px bg-gradient-to-r from-transparent via-emerald-200/60 to-transparent" />

        <div className="site-shell relative z-[4]">
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_.8fr_1fr] gap-9 lg:gap-14">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-2xl font-bold text-white tracking-[-0.04em]">OLI</h3>
                <span className="h-px w-14 bg-gradient-to-r from-emerald-200/80 to-transparent" />
              </div>
              <p className="text-white/[0.68] text-sm leading-6 max-w-md">
                Plataforma de aluguel de carros entre particulares. Conectando motoristas e proprietários de veículos.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Links Úteis</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/search" className="footer-link inline-flex">Buscar carros</Link></li>
                <li><Link to="/reservations" className="footer-link inline-flex">Minhas reservas</Link></li>
                <li><Link to="/profile" className="footer-link inline-flex">Meu perfil</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Contato</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="footer-pill text-sm">+55 11 94017-5031</span>
                <a
                  href="https://wa.me/5511940175031"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-pill text-sm gap-1.5"
                >
                  WhatsApp <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <h4 className="font-semibold mb-3 text-white">Legal</h4>
              <div className="flex flex-wrap gap-2">
                <Link to="/politica-de-privacidade" className="footer-pill text-sm">
                  Política de Privacidade
                </Link>
                <Link to="/termos-de-uso" className="footer-pill text-sm">
                  Termos de Uso
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/[0.12] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-white/[0.55]">
            <p>© {new Date().getFullYear()} Oli Locação. Todos os direitos reservados.</p>
            <p>CNPJ: 57.448.288/0001-89</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
