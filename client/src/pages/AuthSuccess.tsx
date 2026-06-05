import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';

export default function AuthSuccess() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const nome = params.get('nome');
    const email = params.get('email');

    if (id && nome && email) {
      localStorage.setItem('user', JSON.stringify({
        id: Number(id),
        nome: decodeURIComponent(nome),
        email: decodeURIComponent(email),
      }));
      toast.success(`Bem-vindo, ${decodeURIComponent(nome)}!`);
    }

    setLocation('/');
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Autenticando com Google...</p>
    </div>
  );
}
