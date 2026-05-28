import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Navigation } from '@/components/Navigation';
import { toast } from 'sonner';
import { CreditCard, Smartphone, Copy, Check } from 'lucide-react';

export default function Payment() {
  const [, setLocation] = useLocation();
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const coursePrice = 99.90; // Example price
  const pixKey = '12345678901234567890123456789012'; // Example PIX key

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }
    if (name === 'expiryDate') {
      value = value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2').slice(0, 5);
    }
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Chave PIX copiada!');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'credit_card') {
      if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
        toast.error('Por favor, preencha todos os dados do cartão');
        return;
      }
    }

    // Simulate payment processing
    toast.loading('Processando pagamento...');
    setTimeout(() => {
      toast.dismiss();
      toast.success('Pagamento realizado com sucesso!');
      setLocation('/courses');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navigation />
      <div className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Pagamento
          </h1>
          <p className="text-gray-600">Escolha a forma de pagamento que prefere</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="md:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Curso: Programação Web Avançada</p>
                  <p className="text-sm text-gray-600">Professor: João Silva</p>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">R$ {coursePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-600">Taxa</span>
                    <span className="font-semibold">R$ 0,00</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="text-2xl font-bold text-purple-600">R$ {coursePrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Método de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="credit_card" className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span className="hidden sm:inline">Cartão</span>
                    </TabsTrigger>
                    <TabsTrigger value="pix" className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      <span className="hidden sm:inline">PIX</span>
                    </TabsTrigger>
                    <TabsTrigger value="debit" className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span className="hidden sm:inline">Débito</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Credit Card Tab */}
                  <TabsContent value="credit_card">
                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Nome no Cartão</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          placeholder="JOÃO SILVA"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Número do Cartão</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="0000 0000 0000 0000"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          maxLength={19}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Validade</Label>
                          <Input
                            id="expiryDate"
                            name="expiryDate"
                            placeholder="MM/AA"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            placeholder="000"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            maxLength={3}
                            required
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold">
                        Pagar R$ {coursePrice.toFixed(2)}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* PIX Tab */}
                  <TabsContent value="pix">
                    <div className="space-y-4">
                      <div className="bg-purple-50 p-6 rounded-lg text-center">
                        <p className="text-sm text-gray-600 mb-4">Escaneie o QR Code ou copie a chave PIX</p>
                        <div className="bg-white p-4 rounded-lg inline-block mb-4">
                          <div className="w-48 h-48 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-400">QR Code</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Chave PIX</Label>
                        <div className="flex gap-2">
                          <Input
                            value={pixKey}
                            readOnly
                            className="bg-gray-50"
                          />
                          <Button
                            type="button"
                            onClick={handleCopyPix}
                            variant="outline"
                            className="px-4"
                          >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-900">
                          ℹ️ Após realizar a transferência PIX, seu acesso será liberado automaticamente em até 5 minutos.
                        </p>
                      </div>

                      <Button onClick={() => handlePaymentSubmit({} as React.FormEvent)} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold">
                        Confirmar PIX
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Debit Tab */}
                  <TabsContent value="debit">
                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Nome no Cartão</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          placeholder="JOÃO SILVA"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Número do Cartão</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="0000 0000 0000 0000"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          maxLength={19}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Validade</Label>
                          <Input
                            id="expiryDate"
                            name="expiryDate"
                            placeholder="MM/AA"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            placeholder="000"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            maxLength={3}
                            required
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold">
                        Pagar R$ {coursePrice.toFixed(2)}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
