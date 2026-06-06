import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Navigation } from '@/components/Navigation';
import { PageWrapper } from '@/components/PageWrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, BookOpen, X, Check } from 'lucide-react';
import { useLang } from '@/contexts/LangContext';

interface Anuncio { id: number; titulo: string; descricao: string; preco: number; prestador_id: number; }

export default function MeusAnuncios() {
  const { t } = useLang();
  const [, setLocation] = useLocation();
  const [usuario, setUsuario] = useState<any>(null);
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [editando, setEditando] = useState<Anuncio | null>(null);
  const [criando, setCriando] = useState(false);
  const [form, setForm] = useState({ titulo: '', descricao: '', preco: '' });

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { setLocation('/login'); return; }
    const u = JSON.parse(stored); setUsuario(u); buscar(u.id);
  }, []);

  const buscar = async (id: number) => {
    const res = await fetch('/api/meus-anuncios');
    const data = await res.json();
    setAnuncios(data.filter((a: Anuncio) => a.prestador_id === id));
  };

  const handleCriar = async () => {
    if (!form.titulo || !form.descricao || !form.preco) { toast.error(t('my_ads_fill')); return; }
    await fetch('/api/meus-anuncios', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ titulo: form.titulo, descricao: form.descricao, preco: Number(form.preco), prestadorId: usuario.id }) });
    toast.success(t('my_ads_created')); setForm({ titulo: '', descricao: '', preco: '' }); setCriando(false); buscar(usuario.id);
  };

  const handleEditar = async () => {
    if (!editando) return;
    await fetch(`/api/meus-anuncios/${editando.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ titulo: editando.titulo, descricao: editando.descricao, preco: editando.preco }) });
    toast.success(t('my_ads_updated')); setEditando(null); buscar(usuario.id);
  };

  const handleDeletar = async (id: number) => {
    if (!confirm(t('my_ads_confirm_delete'))) return;
    await fetch(`/api/meus-anuncios/${id}`, { method: 'DELETE' });
    toast.success(t('my_ads_deleted')); buscar(usuario.id);
  };

  return (
    <PageWrapper>
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{t('my_ads_title')}</h1>
          <Button onClick={() => { setCriando(true); setEditando(null); }} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center gap-2">
            <Plus className="w-4 h-4" />{t('my_ads_new')}
          </Button>
        </div>
        {criando && (
          <Card className="mb-6 border-purple-200"><CardContent className="py-5 space-y-4">
            <h2 className="font-semibold">{t('my_ads_new')}</h2>
            <div className="space-y-2"><Label>{t('my_ads_form_title')}</Label><Input value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} /></div>
            <div className="space-y-2"><Label>{t('my_ads_form_desc')}</Label><Input value={form.descricao} onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))} /></div>
            <div className="space-y-2"><Label>{t('my_ads_form_price')}</Label><Input type="number" value={form.preco} onChange={e => setForm(p => ({ ...p, preco: e.target.value }))} /></div>
            <div className="flex gap-2">
              <Button onClick={handleCriar} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center gap-2"><Check className="w-4 h-4" />{t('my_ads_save')}</Button>
              <Button variant="outline" onClick={() => setCriando(false)} className="flex items-center gap-2"><X className="w-4 h-4" />{t('my_ads_cancel')}</Button>
            </div>
          </CardContent></Card>
        )}
        {anuncios.length === 0 && !criando ? (
          <Card><CardContent className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <BookOpen className="w-10 h-10" /><p className="text-sm">{t('my_ads_empty')}</p>
          </CardContent></Card>
        ) : (
          <div className="space-y-3">
            {anuncios.map(a => (
              <Card key={a.id}><CardContent className="py-4 px-5">
                {editando?.id === a.id ? (
                  <div className="space-y-3">
                    <Input value={editando.titulo} onChange={e => setEditando(p => p ? { ...p, titulo: e.target.value } : p)} />
                    <Input value={editando.descricao} onChange={e => setEditando(p => p ? { ...p, descricao: e.target.value } : p)} />
                    <Input type="number" value={editando.preco} onChange={e => setEditando(p => p ? { ...p, preco: Number(e.target.value) } : p)} />
                    <div className="flex gap-2">
                      <Button onClick={handleEditar} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center gap-2"><Check className="w-4 h-4" />{t('my_ads_save')}</Button>
                      <Button variant="outline" onClick={() => setEditando(null)} className="flex items-center gap-2"><X className="w-4 h-4" />{t('my_ads_cancel')}</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">{a.titulo}</p>
                      <p className="text-xs text-muted-foreground truncate">{a.descricao}</p>
                      <p className="text-sm font-bold text-purple-600 mt-1">R$ {Number(a.preco).toFixed(2)}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="outline" size="sm" onClick={() => { setEditando(a); setCriando(false); }} className="border-purple-300 text-purple-600 hover:bg-purple-50"><Pencil className="w-4 h-4" /></Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeletar(a.id)} className="border-red-300 text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                )}
              </CardContent></Card>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
