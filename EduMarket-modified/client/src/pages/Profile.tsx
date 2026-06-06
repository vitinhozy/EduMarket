import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Navigation } from '@/components/Navigation';
import { PageWrapper } from '@/components/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { User } from 'lucide-react';
import { useLang } from '@/contexts/LangContext';

export default function Profile() {
  const { t } = useLang();
  const [, setLocation] = useLocation();
  const [usuario, setUsuario] = useState<any>(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { setLocation('/login'); return; }
    const u = JSON.parse(stored);
    setUsuario(u); setNome(u.nome); setEmail(u.email);
  }, []);

  const handleSave = () => {
    const updated = { ...usuario, nome, email };
    localStorage.setItem('user', JSON.stringify(updated));
    setUsuario(updated);
    toast.success(t('saved'));
  };

  const getInitials = (n: string) => n.split(' ').map((x: string) => x[0]).slice(0, 2).join('').toUpperCase();

  return (
    <PageWrapper>
      <Navigation />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">{t('profile_title')}</h1>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                {usuario ? getInitials(usuario.nome) : <User />}
              </div>
              <div><CardTitle>{usuario?.nome}</CardTitle><p className="text-sm text-muted-foreground">{usuario?.email}</p></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>{t('profile_name')}</Label><Input value={nome} onChange={e => setNome(e.target.value)} /></div>
            <div className="space-y-2"><Label>{t('profile_email')}</Label><Input value={email} onChange={e => setEmail(e.target.value)} /></div>
            <Button onClick={handleSave} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white">{t('save')}</Button>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
