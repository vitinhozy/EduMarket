import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { BookOpen, Users, Calendar, MessageSquare, CreditCard, UserPlus, ArrowRight, Star, Zap, Globe } from 'lucide-react';

export default function Home() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: BookOpen,
      title: 'Aulas Disponíveis',
      description: 'Acesse cursos de qualidade com professores experientes',
      action: () => setLocation('/courses'),
      buttonText: 'Ver Cursos'
    },
    {
      icon: Calendar,
      title: 'Agende Aulas',
      description: 'Escolha o horário que melhor se adequa ao seu cronograma',
      action: () => setLocation('/teacher/1'),
      buttonText: 'Agendar'
    },
    {
      icon: MessageSquare,
      title: 'Comunidade',
      description: 'Conecte-se com outros estudantes e compartilhe conhecimento',
      action: () => setLocation('/community'),
      buttonText: 'Entrar na Comunidade'
    },
    {
      icon: CreditCard,
      title: 'Pagamento Seguro',
      description: 'Múltiplas formas de pagamento para sua conveniência',
      action: () => setLocation('/payment'),
      buttonText: 'Ir para Pagamento'
    },
  ];

  const teachers = [
    {
      name: 'João Silva',
      specialty: 'Programação Web',
      rating: 4.9,
      students: 342,
      hourly: 'R$ 80,00'
    },
    {
      name: 'Maria Santos',
      specialty: 'Data Science',
      rating: 4.8,
      students: 256,
      hourly: 'R$ 100,00'
    },
    {
      name: 'Pedro Costa',
      specialty: 'Mobile Development',
      rating: 4.7,
      students: 189,
      hourly: 'R$ 90,00'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Aprenda com os Melhores
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Conecte-se com professores experientes, acesse cursos de qualidade e desenvolva suas habilidades no seu próprio ritmo.
              </p>
              <div className="flex gap-4">
                <Button
                  onClick={() => setLocation('/register')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg"
                >
                  Começar Agora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  onClick={() => setLocation('/courses')}
                  variant="outline"
                  className="px-8 py-6 text-lg border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  Explorar Cursos
                </Button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-400 to-blue-400 rounded-2xl h-96 flex items-center justify-center">
              <span className="text-white text-6xl font-bold">📚</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Funcionalidades Principais
            </span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                    <Button
                      onClick={feature.action}
                      variant="outline"
                      className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                    >
                      {feature.buttonText}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Teachers Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Professores Destaque
            </span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {teachers.map((teacher, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {teacher.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-center mb-1">{teacher.name}</h3>
                  <p className="text-purple-600 font-semibold text-center text-sm mb-4">{teacher.specialty}</p>
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Avaliação</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold">{teacher.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Alunos</span>
                      <span className="font-semibold">{teacher.students}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Valor/hora</span>
                      <span className="font-semibold text-purple-600">{teacher.hourly}</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => setLocation('/teacher/1')}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    Ver Perfil
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <p className="text-purple-100">Alunos Ativos</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <p className="text-purple-100">Cursos Disponíveis</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">200+</div>
              <p className="text-purple-100">Professores</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.8★</div>
              <p className="text-purple-100">Avaliação Média</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para começar sua jornada de aprendizado?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Junte-se a milhares de estudantes que já transformaram suas carreiras com EduMarket
          </p>
          <Button
            onClick={() => setLocation('/register')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-6 text-lg"
          >
            Criar Conta Grátis
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">EduMarket</h3>
              <p className="text-sm">Transformando vidas através da educação online de qualidade.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Cursos</a></li>
                <li><a href="#" className="hover:text-white">Professores</a></li>
                <li><a href="#" className="hover:text-white">Comunidade</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Sobre</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacidade</a></li>
                <li><a href="#" className="hover:text-white">Termos</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 EduMarket. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
