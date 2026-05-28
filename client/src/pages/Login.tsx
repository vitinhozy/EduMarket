import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Navigation } from '@/components/Navigation';
import { toast } from 'sonner';

export default function Login() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    // Simulate login
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Usuário',
      email: formData.email,
      role: 'student',
    };

    localStorage.setItem('user', JSON.stringify(userData));
    toast.success('Bem-vindo de volta!');
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navigation />
      <div className="flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            EduMarket
          </CardTitle>
          <CardDescription>Faça login na sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Sua senha"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                  }
                />
                <Label htmlFor="rememberMe" className="text-sm cursor-pointer">
                  Lembrar-me
                </Label>
              </div>
              <a href="#" className="text-sm text-purple-600 hover:text-purple-700 font-semibold">
                Esqueceu a senha?
              </a>
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold">
              Entrar
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

          <Button variant="outline" className="w-full mb-2">
            Continuar com Google
          </Button>
          <Button variant="outline" className="w-full">
            Continuar com GitHub
          </Button>

          <div className="mt-6 text-center text-sm text-gray-600">
            Não tem conta? <a href="/register" className="text-purple-600 hover:text-purple-700 font-semibold">Crie uma agora</a>
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
