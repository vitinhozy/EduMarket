import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  BookOpen, Menu, X, LogOut, User, Heart,
  BookMarked, CreditCard, Settings, Bell, ShoppingCart, MessageCircle, Megaphone, CalendarDays
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { t } from '@/lib/i18n';

export function Navigation() {
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [usuario, setUsuario] = useState<{ id: number; nome: string; email: string } | null>(null);
  const [qtdCarrinho, setQtdCarrinho] = useState(0);
  const [qtdNotifs, setQtdNotifs] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUsuario(JSON.parse(stored));

    const atualizarContadores = () => {
      const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
      setQtdCarrinho(carrinho.length);
      const notifs = JSON.parse(localStorage.getItem('notificacoes') || '[]');
      setQtdNotifs(notifs.filter((n: any) => !n.lida).length);
    };

    atualizarContadores();
    window.addEventListener('storage', atualizarContadores);
    const interval = setInterval(atualizarContadores, 1000);
    return () => { window.removeEventListener('storage', atualizarContadores); clearInterval(interval); };
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUsuario(null);
    setDropdownOpen(false);
    toast.success('Você saiu da conta');
    setLocation('/');
  };

  const getInitials = (nome: string) =>
    nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

  const navItems = [
    { label: t('nav_courses'), href: '/courses' },
    { label: t('nav_teachers'), href: '/teacher/1' },
    { label: t('nav_community'), href: '/community' },
    { label: t('nav_ads'), href: '/anuncios' },
  ];

  const menuItems = [
    { icon: User,       label: t('menu_account'),     href: '/profile' },
    { icon: BookMarked, label: t('menu_enrollments'), href: '/matriculas' },
    { icon: Heart,      label: t('menu_favorites'),   href: '/favoritos' },
    { icon: CreditCard, label: t('menu_payment'),     href: '/payment' },
    { icon: Settings,   label: t('menu_settings'),   href: '/settings' },
    { icon: Megaphone,  label: t('menu_my_ads'),      href: '/meus-anuncios' },
    { icon: CalendarDays, label: t('menu_my_schedule'), href: '/minha-agenda' },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer shrink-0"
          onClick={() => setLocation('/')}
        >
          <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            EduMarket
          </span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-5 flex-1">
          {navItems.map(item => (
            <a
              key={item.href}
              onClick={() => setLocation(item.href)}
              className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium cursor-pointer transition-colors text-sm whitespace-nowrap"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-2">
          {usuario ? (
            <>
              {/* Ícones de ação */}
              <button
                onClick={() => setLocation('/mensagens')}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-purple-600"
                title={t('nav_messages')}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-purple-600 rounded-full"></span>
              </button>

              <button
                onClick={() => setLocation('/notificacoes')}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-purple-600"
                title={t('nav_alerts')}
              >
                <Bell className="w-5 h-5" />
                {qtdNotifs > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {qtdNotifs}
                  </span>
                )}
              </button>

              <button
                onClick={() => setLocation('/carrinho')}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-purple-600"
                title={t('nav_cart')}
              >
                <ShoppingCart className="w-5 h-5" />
                {qtdCarrinho > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {qtdCarrinho}
                  </span>
                )}
              </button>

              <div className="w-px h-6 bg-gray-200 mx-1" />

              {/* Avatar com dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-sm font-bold hover:opacity-90 transition-opacity ring-2 ring-offset-1 ring-purple-200"
                >
                  {getInitials(usuario.nome)}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">

                    {/* Perfil */}
                    <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-700 border-b border-gray-100 dark:border-gray-600">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {getInitials(usuario.nome)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 text-sm truncate">{usuario.nome}</p>
                          <p className="text-xs text-gray-500 truncate">{usuario.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Atalhos rápidos */}
                    <div className="grid grid-cols-3 border-b border-gray-100">
                      <button
                        onClick={() => { setLocation('/mensagens'); setDropdownOpen(false); }}
                        className="flex flex-col items-center gap-1 py-3 hover:bg-purple-50 transition-colors text-gray-600 hover:text-purple-600"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-xs">{t('nav_messages')}</span>
                      </button>
                      <button
                        onClick={() => { setLocation('/notificacoes'); setDropdownOpen(false); }}
                        className="flex flex-col items-center gap-1 py-3 hover:bg-purple-50 transition-colors text-gray-600 hover:text-purple-600 border-x border-gray-100"
                      >
                        <Bell className="w-4 h-4" />
                        <span className="text-xs">{t('nav_alerts')}</span>
                      </button>
                      <button
                        onClick={() => { setLocation('/carrinho'); setDropdownOpen(false); }}
                        className="flex flex-col items-center gap-1 py-3 hover:bg-purple-50 transition-colors text-gray-600 hover:text-purple-600"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span className="text-xs">{t('nav_cart')}</span>
                      </button>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      {menuItems.map(item => (
                        <button
                          key={item.href}
                          onClick={() => { setLocation(item.href); setDropdownOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-left"
                        >
                          <item.icon className="w-4 h-4 shrink-0" />
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {/* Sair */}
                    <div className="border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 shrink-0" />
                        Sair da conta
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Button
                onClick={() => setLocation('/login')}
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50 text-sm"
              >
                Login
              </Button>
              <Button
                onClick={() => setLocation('/register')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm"
              >
                Cadastro
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map(item => (
              <a
                key={item.href}
                onClick={() => { setLocation(item.href); setMobileMenuOpen(false); }}
                className="text-gray-600 hover:text-purple-600 font-medium cursor-pointer transition-colors px-4 py-2 rounded-lg"
              >
                {item.label}
              </a>
            ))}

            {usuario ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3 mt-2 border-t border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {getInitials(usuario.nome)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{usuario.nome}</p>
                    <p className="text-xs text-gray-500 truncate">{usuario.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1 mt-1">
                  {[
                    { icon: MessageCircle, label: 'Mensagens', href: '/mensagens' },
                    { icon: Bell, label: 'Alertas', href: '/notificacoes' },
                    { icon: ShoppingCart, label: 'Carrinho', href: '/carrinho' },
                  ].map(item => (
                    <button
                      key={item.href}
                      onClick={() => { setLocation(item.href); setMobileMenuOpen(false); }}
                      className="flex flex-col items-center gap-1 py-2 hover:bg-purple-50 rounded-lg transition-colors text-gray-600 hover:text-purple-600"
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  ))}
                </div>

                {menuItems.map(item => (
                  <button
                    key={item.href}
                    onClick={() => { setLocation(item.href); setMobileMenuOpen(false); }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors text-left rounded-lg"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}

                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left rounded-lg border-t border-gray-100 mt-1 pt-3"
                >
                  <LogOut className="w-4 h-4" />
                  Sair da conta
                </button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => { setLocation('/login'); setMobileMenuOpen(false); }}
                  variant="outline"
                  className="border-purple-600 text-purple-600 hover:bg-purple-50 w-full mt-2"
                >
                  Login
                </Button>
                <Button
                  onClick={() => { setLocation('/register'); setMobileMenuOpen(false); }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white w-full"
                >
                  Cadastro
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
