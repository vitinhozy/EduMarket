import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Calendar, X, Check } from 'lucide-react';

interface Slot {
  id: number;
  prestador_id: number;
  data: string;
  horario: string;
  disponivel: number;
}

export default function MinhaAgenda() {
  const [, setLocation] = useLocation();
  const [usuario, setUsuario] = useState<any>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [editando, setEditando] = useState<Slot | null>(null);
  const [criando, setCriando] = useState(false);
  const [form, setForm] = useState({ data: '', horario: '', disponivel: 1 });

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { setLocation('/login'); return; }
    const u = JSON.parse(stored);
    setUsuario(u);
    buscarAgenda(u.id);
  }, []);

  const buscarAgenda = async (prestadorId: number) => {
    const res = await fetch('/agenda');
    const data = await res.json();
    setSlots(data.filter((s: Slot) => s.prestador_id === prestadorId));
  };

  const handleCriar = async () => {
    if (!form.data || !form.horario) { toast.error('Preencha data e horário'); return; }
    await fetch('/agenda', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prestadorId: usuario.id, data: form.data, horario: form.horario, disponivel: form.disponivel }),
    });
    toast.success('Horário adicionado!');
    setForm({ data: '', horario: '', disponivel: 1 });
    setCriando(false);
    buscarAgenda(usuario.id);
  };

  const handleEditar = async () => {
    if (!editando) return;
    await fetch(`/agenda/${editando.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: editando.data, horario: editando.horario, disponivel: editando.disponivel }),
    });
    toast.success('Horário atualizado!');
    setEditando(null);
    buscarAgenda(usuario.id);
  };

  const handleDeletar = async (id: number) => {
    if (!confirm('Deseja excluir este horário?')) return;
    await fetch(`/agenda/${id}`, { method: 'DELETE' });
    toast.success('Horário excluído!');
    buscarAgenda(usuario.id);
  };

  const toggleDisponivel = async (slot: Slot) => {
    await fetch(`/agenda/${slot.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: slot.data, horario: slot.horario, disponivel: slot.disponivel === 1 ? 0 : 1 }),
    });
    buscarAgenda(usuario.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Minha Agenda</h1>
          <Button
            onClick={() => { setCriando(true); setEditando(null); }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Novo Horário
          </Button>
        </div>

        {/* Formulário de criação */}
        {criando && (
          <Card className="shadow-md mb-6 border-purple-200">
            <CardContent className="py-5 space-y-4">
              <h2 className="font-semibold text-gray-800">Novo Horário</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data</Label>
                  <Input type="date" value={form.data} onChange={e => setForm(p => ({ ...p, data: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Horário</Label>
                  <Input type="time" value={form.horario} onChange={e => setForm(p => ({ ...p, horario: e.target.value }))} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Label>Disponível</Label>
                <button
                  onClick={() => setForm(p => ({ ...p, disponivel: p.disponivel === 1 ? 0 : 1 }))}
                  className={`w-10 h-6 rounded-full transition-colors ${form.disponivel === 1 ? 'bg-purple-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform ${form.disponivel === 1 ? 'translate-x-4' : ''}`} />
                </button>
                <span className="text-sm text-gray-600">{form.disponivel === 1 ? 'Sim' : 'Não'}</span>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCriar} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center gap-2">
                  <Check className="w-4 h-4" /> Salvar
                </Button>
                <Button variant="outline" onClick={() => setCriando(false)} className="flex items-center gap-2">
                  <X className="w-4 h-4" /> Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de horários */}
        {slots.length === 0 && !criando ? (
          <Card className="shadow-md">
            <CardContent className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
              <Calendar className="w-10 h-10" />
              <p className="text-sm">Você ainda não tem horários cadastrados.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {slots.map(s => (
              <Card key={s.id} className="shadow-sm">
                <CardContent className="py-4 px-5">
                  {editando?.id === s.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Input type="date" value={editando.data} onChange={e => setEditando(p => p ? { ...p, data: e.target.value } : p)} />
                        <Input type="time" value={editando.horario} onChange={e => setEditando(p => p ? { ...p, horario: e.target.value } : p)} />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleEditar} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center gap-2">
                          <Check className="w-4 h-4" /> Salvar
                        </Button>
                        <Button variant="outline" onClick={() => setEditando(null)} className="flex items-center gap-2">
                          <X className="w-4 h-4" /> Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <Calendar className="w-5 h-5 text-purple-600 shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-800">{s.data} às {s.horario}</p>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.disponivel === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                            {s.disponivel === 1 ? 'Disponível' : 'Indisponível'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => toggleDisponivel(s)}
                          className={`w-10 h-6 rounded-full transition-colors ${s.disponivel === 1 ? 'bg-purple-600' : 'bg-gray-300'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform ${s.disponivel === 1 ? 'translate-x-4' : ''}`} />
                        </button>
                        <Button variant="outline" size="sm" onClick={() => { setEditando(s); setCriando(false); }} className="border-purple-300 text-purple-600 hover:bg-purple-50">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeletar(s.id)} className="border-red-300 text-red-500 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
