import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { PageWrapper } from '@/components/PageWrapper';
import { toast } from 'sonner';

export default function Register() {
  const { t } = useLang();
  const [, setLocation] = useLocation();
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', specialization: '', hourlyRate: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error(t('register_error_fields')); return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error(t('register_error_pass')); return;
    }
    if (formData.password.length < 6) {
      toast.error('Senha deve ter ao menos 6 caracteres'); return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.name,
          email: formData.email,
          senha: formData.password,
        }),
      });

      if (!response.ok) {
        toast.error('Erro ao criar conta. Tente novamente.');
        return;
      }

      const usuarios = await fetch('/api/usuarios').then(r => r.json());
      const usuario = usuarios.find((u: any) => u.email === formData.email);

      if (usuario) {
        localStorage.setItem('user', JSON.stringify({
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
        }));
      }

      toast.success(`Conta criada com sucesso! Bem-vindo, ${formData.name}!`);
      setLocation('/');
    } catch (error) {
      toast.error('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  // Passo 2: Verificar código e criar conta
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (code.length !== 6) {
      toast.error('Digite o código de 6 dígitos'); return;
    }

    setLoading(true);
    try {
      // Verificar código
      const verifyRes = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, code }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        toast.error(verifyData.error || 'Código inválido');
        return;
      }

      // Criar conta
      const registerRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.name,
          email: formData.email,
          senha: formData.password,
        }),
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        toast.error(registerData.error || 'Erro ao criar conta');
        return;
      }

      localStorage.setItem('user', JSON.stringify(registerData.usuario));
      toast.success(`Conta criada! Bem-vindo, ${formData.name}!`);
      setLocation('/');
    } catch {
      toast.error('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  // Reenviar código
  const handleResend = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      toast.success('Novo código enviado!');
    } catch {
      toast.error('Erro ao reenviar código');
    } finally {
      setLoading(false);
    }
  };

  // Tela de sucesso
  if (step === 'success') {
    return (
      <PageWrapper>
        <Navigation />
        <div className="flex items-center justify-center py-20 px-4">
          <div className="text-center max-w-md">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Conta criada com sucesso!</h1>
            <p className="text-muted-foreground mb-8">
              Bem-vindo ao EduMarket, <strong>{formData.name}</strong>! Seu email foi verificado.
            </p>
            <Button
              onClick={() => setLocation('/')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8"
            >
              Ir para o início
            </Button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // Tela de verificação de código
  if (step === 'verify') {
    return (
      <PageWrapper>
        <Navigation />
        <div className="flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Verifique seu email</CardTitle>
              <CardDescription>
                Enviamos um código de 6 dígitos para<br />
                <strong>{formData.email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label>Código de verificação</Label>
                  <Input
                    placeholder="000000"
                    value={code}
                    onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center text-2xl font-bold tracking-widest"
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    O código expira em 10 minutos
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
                >
                  {loading ? 'Verificando...' : 'Verificar e criar conta'}
                </Button>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" /> Voltar
                  </button>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={loading}
                    className="text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    Reenviar código
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  // Tela do formulário de cadastro
  return (
    <PageWrapper>
      <Navigation />
      <div className="flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              EduMarket
            </CardTitle>
            <CardDescription>Crie sua conta e comece a aprender ou ensinar</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={role} onValueChange={(value) => setRole(value as 'student' | 'teacher')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="student">Aluno</TabsTrigger>
                <TabsTrigger value="teacher">Professor</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('register_name')}</Label>
                  <Input name="name" placeholder="Seu nome" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label>{t('login_email')}</Label>
                  <Input name="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label>{t('register_phone')}</Label>
                  <Input name="phone" placeholder="(11) 99999-9999" value={formData.phone} onChange={handleInputChange} />
                </div>

                <TabsContent value="teacher" className="space-y-4 mt-0 p-0">
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Especialização</Label>
                    <Input
                      id="specialization"
                      name="specialization"
                      placeholder="Ex: Programação Web"
                      value={formData.specialization}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Valor da Hora (R$)</Label>
                    <Input
                      id="hourlyRate"
                      name="hourlyRate"
                      type="number"
                      placeholder="50.00"
                      value={formData.hourlyRate}
                      onChange={handleInputChange}
                    />
                  </div>
                </TabsContent>

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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirme sua senha"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
                >
                  {loading ? 'Criando conta...' : 'Criar Conta'}
                </Button>
              </form>

              <div className="mt-4 text-center text-sm text-gray-600">
                Já tem conta?{' '}
                <a href="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
                  Faça login
                </a>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
