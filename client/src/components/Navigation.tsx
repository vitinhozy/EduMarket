import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navigation() {
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Cursos', href: '/courses' },
    { label: 'Professores', href: '/teacher/1' },
    { label: 'Comunidade', href: '/community' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setLocation('/')}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            EduMarket
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map(item => (
            <a
              key={item.href}
              onClick={() => setLocation(item.href)}
              className="text-gray-600 hover:text-purple-600 font-medium cursor-pointer transition-colors"
            >
              {item.label}
            </a>
          ))}
          <Button
            onClick={() => setLocation('/login')}
            variant="outline"
            className="border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            Login
          </Button>
          <Button
            onClick={() => setLocation('/register')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            Cadastro
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-600" />
          ) : (
            <Menu className="w-6 h-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <nav className="flex flex-col gap-2 p-4">
            {navItems.map(item => (
              <a
                key={item.href}
                onClick={() => {
                  setLocation(item.href);
                  setMobileMenuOpen(false);
                }}
                className="text-gray-600 hover:text-purple-600 font-medium cursor-pointer transition-colors px-4 py-2"
              >
                {item.label}
              </a>
            ))}
            <Button
              onClick={() => {
                setLocation('/login');
                setMobileMenuOpen(false);
              }}
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-50 w-full"
            >
              Login
            </Button>
            <Button
              onClick={() => {
                setLocation('/register');
                setMobileMenuOpen(false);
              }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white w-full"
            >
              Cadastro
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
