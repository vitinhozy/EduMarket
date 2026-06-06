import { Navigation } from '@/components/Navigation';
import { PageWrapper } from '@/components/PageWrapper';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { useLang } from '@/contexts/LangContext';

export default function Mensagens() {
  const { t } = useLang();
  return (
    <PageWrapper>
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">{t('messages_title')}</h1>
        <Card><CardContent className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
          <MessageCircle className="w-10 h-10" /><p className="text-sm">{t('messages_empty')}</p>
        </CardContent></Card>
      </div>
    </PageWrapper>
  );
}
