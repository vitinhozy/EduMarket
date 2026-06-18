import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Navigation } from '@/components/Navigation';
<<<<<<< HEAD
import { Card, CardContent } from '@/components/ui/card';
import { BookMarked } from 'lucide-react';

export default function Matriculas() {
=======
import { PageWrapper } from '@/components/PageWrapper';
import { Card, CardContent } from '@/components/ui/card';
import { BookMarked } from 'lucide-react';
import { useLang } from '@/contexts/LangContext';

export default function Matriculas() {
  const { t } = useLang();
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328
  const [, setLocation] = useLocation();
  const [matriculas, setMatriculas] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { setLocation('/login'); return; }
<<<<<<< HEAD
    fetch('/api/matriculas')
      .then(r => r.json())
      .then(data => setMatriculas(data))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Minhas Matrículas</h1>
        {matriculas.length === 0 ? (
          <Card className="shadow-md">
            <CardContent className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
              <BookMarked className="w-10 h-10" />
              <p className="text-sm">Você ainda não possui matrículas.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {matriculas.map((m: any) => (
              <Card key={m.id} className="shadow-sm">
                <CardContent className="py-4 px-5 flex items-center gap-3">
                  <BookMarked className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-800">Matrícula #{m.id}</p>
                    <p className="text-xs text-gray-500">Aula ID: {m.aula_id}</p>
                  </div>
                </CardContent>
              </Card>
=======
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
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328
            ))}
          </div>
        )}
      </div>
<<<<<<< HEAD
    </div>
=======
    </PageWrapper>
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328
  );
}
