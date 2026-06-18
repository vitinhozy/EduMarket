import { useEffect } from 'react';
<<<<<<< HEAD
import { useLocation } from 'wouter';
import { toast } from 'sonner';

export default function AuthSuccess() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const nome = params.get('nome');
=======
import { toast } from 'sonner';
import { GraduationCap } from 'lucide-react';

export default function AuthSuccess() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id    = params.get('id');
    const nome  = params.get('nome');
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328
    const email = params.get('email');

    if (id && nome && email) {
      localStorage.setItem('user', JSON.stringify({
        id: Number(id),
        nome: decodeURIComponent(nome),
        email: decodeURIComponent(email),
      }));
      toast.success(`Bem-vindo, ${decodeURIComponent(nome)}!`);
    }

<<<<<<< HEAD
    setLocation('/');
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Autenticando com Google...</p>
=======
    // Reload completo para o Navigation detectar o usuário corretamente
    window.location.href = '/';
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
      <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
        <GraduationCap className="w-8 h-8 text-white" />
      </div>
      <p className="text-muted-foreground text-lg font-medium">Autenticando com Google...</p>
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328
    </div>
  );
}
