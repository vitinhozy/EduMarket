import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { PageWrapper } from '@/components/PageWrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck } from 'lucide-react';
import { useLang } from '@/contexts/LangContext';

interface Notificacao { id: number; titulo: string; mensagem: string; data: string; lida: boolean; }

export default function Notificacoes() {
  const { t } = useLang();
  const [notifs, setNotifs] = useState<Notificacao[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('notificacoes');
    if (stored) setNotifs(JSON.parse(stored));
  }, []);

  const marcarTodasLidas = () => {
    const atualizadas = notifs.map(n => ({ ...n, lida: true }));
    setNotifs(atualizadas);
    localStorage.setItem('notificacoes', JSON.stringify(atualizadas));
  };

  const naoLidas = notifs.filter(n => !n.lida).length;

  return (
    <PageWrapper>
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{t('notif_title')}</h1>
            {naoLidas > 0 && <p className="text-sm text-purple-600 mt-1">{naoLidas} {t('notif_unread')}</p>}
          </div>
          {naoLidas > 0 && (
            <Button variant="outline" onClick={marcarTodasLidas} className="flex items-center gap-2 text-sm border-purple-300 text-purple-600 hover:bg-purple-50">
              <CheckCheck className="w-4 h-4" />{t('notif_mark_all')}
            </Button>
          )}
        </div>
        {notifs.length === 0 ? (
          <Card><CardContent className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <Bell className="w-10 h-10" /><p className="text-sm">{t('notif_empty')}</p>
          </CardContent></Card>
        ) : (
          <div className="space-y-3">
            {notifs.map(n => (
              <Card key={n.id} className={!n.lida ? 'border-purple-200' : ''}>
                <CardContent className="py-4 px-5 flex gap-4 items-start">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${!n.lida ? 'bg-purple-600' : 'bg-muted'}`}>
                    <Bell className={`w-4 h-4 ${!n.lida ? 'text-white' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`font-semibold text-sm ${!n.lida ? 'text-purple-700' : ''}`}>{n.titulo}</p>
                      <span className="text-xs text-muted-foreground shrink-0">{n.data}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{n.mensagem}</p>
                  </div>
                  {!n.lida && <div className="w-2 h-2 rounded-full bg-purple-600 shrink-0 mt-2" />}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
