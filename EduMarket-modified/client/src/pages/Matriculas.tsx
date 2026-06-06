import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Navigation } from '@/components/Navigation';
import { PageWrapper } from '@/components/PageWrapper';
import { Card, CardContent } from '@/components/ui/card';
import { BookMarked } from 'lucide-react';
import { useLang } from '@/contexts/LangContext';

export default function Matriculas() {
  const { t } = useLang();
  const [, setLocation] = useLocation();
  const [matriculas, setMatriculas] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { setLocation('/login'); return; }
    fetch('/api/matriculas').then(r => r.json()).then(setMatriculas).catch(() => {});
  }, []);

  return (
    <PageWrapper>
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">{t('enrollments_title')}</h1>
        {matriculas.length === 0 ? (
          <Card><CardContent className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <BookMarked className="w-10 h-10" /><p className="text-sm">{t('enrollments_empty')}</p>
          </CardContent></Card>
        ) : (
          <div className="space-y-3">
            {matriculas.map((m: any) => (
              <Card key={m.id}><CardContent className="py-4 px-5 flex items-center gap-3">
                <BookMarked className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium">{t('enrollments_id')} #{m.id}</p>
                  <p className="text-xs text-muted-foreground">{t('enrollments_class')}: {m.aula_id}</p>
                </div>
              </CardContent></Card>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
