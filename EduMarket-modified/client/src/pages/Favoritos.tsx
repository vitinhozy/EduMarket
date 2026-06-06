import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Navigation } from '@/components/Navigation';
import { PageWrapper } from '@/components/PageWrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLang } from '@/contexts/LangContext';

export default function Favoritos() {
  const { t } = useLang();
  const [, setLocation] = useLocation();
  const [favoritos, setFavoritos] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { setLocation('/login'); return; }
    const u = JSON.parse(stored);
    fetch(`/api/favoritos/${u.id}`).then(r => r.json()).then(setFavoritos).catch(() => {});
  }, []);

  const handleRemover = async (id: number) => {
    await fetch(`/api/favoritos/${id}`, { method: 'DELETE' });
    setFavoritos(prev => prev.filter(f => f.id !== id));
    toast.success('Removido!');
  };

  return (
    <PageWrapper>
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">{t('favorites_title')}</h1>
        {favoritos.length === 0 ? (
          <Card><CardContent className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <Heart className="w-10 h-10" /><p className="text-sm">{t('favorites_empty')}</p>
          </CardContent></Card>
        ) : (
          <div className="space-y-3">
            {favoritos.map((f: any) => (
              <Card key={f.id}><CardContent className="py-4 px-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                  <div>
                    <p className="font-semibold">{t('favorites_provider')} #{f.prestador_id}</p>
                    <p className="text-xs text-muted-foreground">{t('favorites_by')}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleRemover(f.id)} className="border-red-300 text-red-500 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent></Card>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
