import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Navigation } from '@/components/Navigation';
import { PageWrapper } from '@/components/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CreditCard, Lock, CheckCircle, ShoppingCart, Tag, X } from 'lucide-react';
import { useLang } from '@/contexts/LangContext';

interface ItemCarrinho {
  id: string;
  titulo: string;
  descricao: string;
  preco: number;
}

type Status = 'idle' | 'processing' | 'success' | 'error';

const CUPONS: Record<string, number> = {
  'JAUM': 1.00,
  'EDUMARKET10': 0.10,
  'BEMVINDO20': 0.20,
};

export default function Payment() {
  const { t } = useLang();
  const [, setLocation] = useLocation();
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [cupom, setCupom] = useState('');
  const [cupomAplicado, setCupomAplicado] = useState('');
  const [desconto, setDesconto] = useState(0);
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '', name: '' });

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { setLocation('/login'); return; }
    const carrinho = localStorage.getItem('carrinho');
    if (carrinho) setItens(JSON.parse(carrinho));
  }, []);

  const subtotal = itens.reduce((acc, i) => acc + i.preco, 0);
  const valorDesconto = subtotal * desconto;
  const total = subtotal - valorDesconto;
  const isGratuito = total <= 0 && cupomAplicado !== '';

  const formatCardNumber = (v: string) => v.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
  const formatExpiry = (v: string) => v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);

  const handleAplicarCupom = () => {
    const code = cupom.trim().toUpperCase();
    if (!code) return;
    if (CUPONS[code] !== undefined) {
      setDesconto(CUPONS[code]);
      setCupomAplicado(code);
      setCupom('');
      toast.success(`Cupom ${code} aplicado! ${(CUPONS[code] * 100).toFixed(0)}% de desconto`);
    } else {
      toast.error('Cupom inválido ou expirado');
    }
  };

  const handleRemoverCupom = () => {
    setCupomAplicado('');
    setDesconto(0);
    setCupom('');
  };

  const salvarCursos = (itensPagos: typeof itens) => {
    const meusCursos = JSON.parse(localStorage.getItem('meus_cursos') || '[]');
    itensPagos.forEach(item => {
      if (!meusCursos.find((c: any) => c.id === item.id)) {
        meusCursos.push({ ...item, dataCompra: new Date().toLocaleDateString('pt-BR') });
      }
    });
    localStorage.setItem('meus_cursos', JSON.stringify(meusCursos));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itens.length) { toast.error('Seu carrinho está vazio'); return; }

    // Cupom 100% — sem cartão necessário
    if (isGratuito) {
      setStatus('processing');
      await new Promise(r => setTimeout(r, 800));
      const notifs = JSON.parse(localStorage.getItem('notificacoes') || '[]');
      itens.forEach(item => {
        notifs.unshift({
          id: Date.now() + Math.random(),
          titulo: '🎉 Curso adquirido gratuitamente!',
          mensagem: `"${item.titulo}" foi adicionado aos seus cursos com cupom de 100%.`,
          data: new Date().toLocaleDateString('pt-BR'),
          lida: false,
        });
      });
      localStorage.setItem('notificacoes', JSON.stringify(notifs));
      salvarCursos(itens);
      localStorage.setItem('carrinho', JSON.stringify([]));
      setStatus('success');
      return;
    }

    // Pagamento com cartão
    if (!cardData.name || !cardData.number || !cardData.expiry || !cardData.cvc) {
      toast.error('Preencha todos os dados do cartão');
      return;
    }

    setStatus('processing');
    try {
      const intentRes = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'brl',
          description: `EduMarket — ${itens.map(i => i.titulo).join(', ')}`,
        }),
      });

      const intentData = await intentRes.json();
      if (!intentRes.ok) throw new Error(intentData.error || 'Erro ao processar pagamento');

      await new Promise(r => setTimeout(r, 1500));

      const notifs = JSON.parse(localStorage.getItem('notificacoes') || '[]');
      itens.forEach(item => {
        notifs.unshift({
          id: Date.now() + Math.random(),
          titulo: '✅ Pagamento confirmado!',
          mensagem: `Sua compra de "${item.titulo}" foi processada com sucesso.`,
          data: new Date().toLocaleDateString('pt-BR'),
          lida: false,
        });
      });
      localStorage.setItem('notificacoes', JSON.stringify(notifs));
      salvarCursos(itens);
      localStorage.setItem('carrinho', JSON.stringify([]));
      setStatus('success');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao processar pagamento');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <PageWrapper>
        <Navigation />
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">
            {isGratuito ? 'Curso adquirido!' : 'Pagamento confirmado!'}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isGratuito
              ? 'Seu curso foi adquirido gratuitamente com sucesso!'
              : 'Sua compra foi processada com sucesso pelo Stripe.'}
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => setLocation('/meus-cursos')} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              Meus Cursos
            </Button>
            <Button onClick={() => setLocation('/')} variant="outline">
              Voltar ao início
            </Button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-purple-600" /> Pagamento seguro
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Resumo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShoppingCart className="w-5 h-5" /> Resumo do pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              {itens.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">Carrinho vazio</p>
                  <Button onClick={() => setLocation('/anuncios')} className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white" size="sm">
                    Ver anúncios
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {itens.map(item => (
                    <div key={item.id} className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.titulo}</p>
                        <p className="text-xs text-muted-foreground truncate">{item.descricao}</p>
                      </div>
                      <span className="text-sm font-bold text-purple-600 shrink-0">R$ {item.preco.toFixed(2)}</span>
                    </div>
                  ))}

                  <div className="border-t pt-3 space-y-3">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Subtotal</span>
                      <span>R$ {subtotal.toFixed(2)}</span>
                    </div>

                    {/* Campo cupom */}
                    {!cupomAplicado ? (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Código do cupom"
                          value={cupom}
                          onChange={e => setCupom(e.target.value.toUpperCase())}
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAplicarCupom())}
                          className="flex-1 h-8 text-sm"
                        />
                        <Button type="button" size="sm" onClick={handleAplicarCupom} variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50 flex items-center gap-1 shrink-0">
                          <Tag className="w-3 h-3" /> Aplicar
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-400 text-sm">
                          <Tag className="w-4 h-4" />
                          <span className="font-semibold">{cupomAplicado}</span>
                          <span>— {(desconto * 100).toFixed(0)}% de desconto</span>
                        </div>
                        <button type="button" onClick={handleRemoverCupom} className="text-green-600 hover:text-red-500">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {cupomAplicado && (
                      <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                        <span>Desconto ({(desconto * 100).toFixed(0)}%)</span>
                        <span>- R$ {valorDesconto.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-semibold">Total</span>
                      <div className="text-right">
                        {cupomAplicado && <p className="text-xs text-muted-foreground line-through">R$ {subtotal.toFixed(2)}</p>}
                        <span className="text-xl font-bold text-purple-600">R$ {total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Lock className="w-5 h-5 text-green-500" />
                {isGratuito ? 'Curso Gratuito 🎉' : 'Dados do cartão'}
                {!isGratuito && (
                  <span className="ml-auto">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-5 inline mr-2" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5 inline" />
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {isGratuito ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-3xl">🎉</span>
                    </div>
                    <div>
                      <p className="font-semibold text-lg">Cupom aplicado!</p>
                      <p className="text-muted-foreground text-sm mt-1">
                        Seu cupom cobre 100% do valor.<br />
                        Clique abaixo para adquirir gratuitamente.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>Nome no cartão</Label>
                      <Input placeholder="João Silva" value={cardData.name} onChange={e => setCardData(p => ({ ...p, name: e.target.value }))} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Número do cartão</Label>
                      <Input placeholder="4242 4242 4242 4242" value={cardData.number} onChange={e => setCardData(p => ({ ...p, number: formatCardNumber(e.target.value) }))} maxLength={19} required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Validade</Label>
                        <Input placeholder="MM/AA" value={cardData.expiry} onChange={e => setCardData(p => ({ ...p, expiry: formatExpiry(e.target.value) }))} maxLength={5} required />
                      </div>
                      <div className="space-y-2">
                        <Label>CVC</Label>
                        <Input placeholder="123" value={cardData.cvc} onChange={e => setCardData(p => ({ ...p, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) }))} maxLength={4} required />
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3 text-xs text-blue-700 dark:text-blue-300">
                      <p className="font-semibold mb-1">🧪 Cartão de teste Stripe:</p>
                      <p>Número: <span className="font-mono">4242 4242 4242 4242</span></p>
                      <p>Validade: qualquer data futura | CVC: qualquer 3 dígitos</p>
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  disabled={status === 'processing' || !itens.length}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  {status === 'processing'
                    ? 'Processando...'
                    : isGratuito
                    ? '🎉 Adquirir Gratuitamente'
                    : `Pagar R$ ${total.toFixed(2)}`}
                </Button>

                <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" />
                  {isGratuito ? 'Curso adquirido com cupom de desconto' : 'Pagamento processado com segurança pelo Stripe'}
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
