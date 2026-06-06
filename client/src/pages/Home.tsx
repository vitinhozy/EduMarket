import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { PageWrapper } from '@/components/PageWrapper';
import { BookOpen, Calendar, MessageSquare, CreditCard, ArrowRight, Star } from 'lucide-react';
import { useLang } from '@/contexts/LangContext';

export default function Home() {
  const { t } = useLang();
  const [, setLocation] = useLocation();

  const cursosCarrossel = [
    { titulo: 'Desenvolvimento Web Completo', videoId: 'SqcY0GlETPk', alunos: '45.2k', rating: '4.8', duracao: '12h 30min' },
    { titulo: 'Python para Data Science',     videoId: 'rfscVS0vtbw', alunos: '38.7k', rating: '4.9', duracao: '8h 15min'  },
    { titulo: 'UI/UX Design na Prática',      videoId: 'lHOlAEAMIX0', alunos: '22.1k', rating: '4.7', duracao: '6h 45min'  },
    { titulo: 'Flutter & Dart Mobile',        videoId: 'VPvVD8t02U8', alunos: '31.4k', rating: '4.8', duracao: '10h 20min' },
    { titulo: 'DevOps e Docker',              videoId: 'Wvf0mBNGjXY', alunos: '18.9k', rating: '4.6', duracao: '9h 00min'  },
    { titulo: 'Banco de Dados SQL e NoSQL',   videoId: 'HXV3zeQKqGY', alunos: '27.3k', rating: '4.8', duracao: '7h 30min'  },
  ];

  const [carIdx, setCarIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCarIdx(i => (i + 1) % cursosCarrossel.length), 3000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    { icon: BookOpen,      title: t('home_f1_title'), description: t('home_f1_desc'), action: () => setLocation('/courses'),    btn: t('home_f1_btn') },
    { icon: Calendar,      title: t('home_f2_title'), description: t('home_f2_desc'), action: () => setLocation('/teacher/1'),  btn: t('home_f2_btn') },
    { icon: MessageSquare, title: t('home_f3_title'), description: t('home_f3_desc'), action: () => setLocation('/community'),  btn: t('home_f3_btn') },
    { icon: CreditCard,    title: t('home_f4_title'), description: t('home_f4_desc'), action: () => setLocation('/payment'),    btn: t('home_f4_btn') },
  ];

  const teachers = [
    { name: 'João Silva',   specialty: 'Programação Web',     rating: 4.9, students: 342, hourly: 'R$ 80,00' },
    { name: 'Maria Santos', specialty: 'Data Science',         rating: 4.8, students: 256, hourly: 'R$ 100,00' },
    { name: 'Pedro Costa',  specialty: 'Mobile Development',   rating: 4.7, students: 189, hourly: 'R$ 90,00' },
  ];

  return (
    <PageWrapper>
      <Navigation />

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {t('home_hero_title')}
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {t('home_hero_sub')}
              </p>
              <div className="flex gap-4 flex-wrap">
                <Button onClick={() => setLocation('/register')} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg">
                  {t('home_start')} <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button onClick={() => setLocation('/courses')} variant="outline" className="px-8 py-6 text-lg border-2 border-purple-600 text-purple-600 hover:bg-purple-50">
                  {t('home_explore')}
                </Button>
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              {/* Slides */}
              {cursosCarrossel.map((curso, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-700 ${idx === carIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                  <img
                    src={`https://img.youtube.com/vi/${curso.videoId}/maxresdefault.jpg`}
                    alt={curso.titulo}
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${curso.videoId}/hqdefault.jpg`; }}
                  />
                  {/* Overlay gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {/* Info do curso */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-white font-bold text-lg leading-tight mb-2">{curso.titulo}</p>
                    <div className="flex items-center gap-3 text-sm text-white/80">
                      <span>⭐ {curso.rating}</span>
                      <span>👥 {curso.alunos} alunos</span>
                      <span>🕐 {curso.duracao}</span>
                    </div>
                    <button
                      onClick={() => setLocation('/anuncios')}
                      className="mt-3 bg-white text-purple-700 font-semibold text-sm px-4 py-1.5 rounded-full hover:bg-purple-50 transition-colors"
                    >
                      Ver curso →
                    </button>
                  </div>
                </div>
              ))}

              {/* Indicadores */}
              <div className="absolute bottom-3 right-4 z-20 flex gap-1.5">
                {cursosCarrossel.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCarIdx(i)}
                    className={`rounded-full transition-all duration-300 ${i === carIdx ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/50'}`}
                  />
                ))}
              </div>

              {/* Setas */}
              <button
                onClick={() => setCarIdx(i => (i - 1 + cursosCarrossel.length) % cursosCarrossel.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors"
              >‹</button>
              <button
                onClick={() => setCarIdx(i => (i + 1) % cursosCarrossel.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors"
              >›</button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {t('home_features')}
            </span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{f.description}</p>
                    <Button onClick={f.action} variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50">
                      {f.btn} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Teachers */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {t('home_teachers')}
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
                      <span className="text-muted-foreground">{t('home_rating')}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold">{teacher.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t('home_students')}</span>
                      <span className="font-semibold">{teacher.students}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t('home_hourly')}</span>
                      <span className="font-semibold text-purple-600">{teacher.hourly}</span>
                    </div>
                  </div>
                  <Button onClick={() => setLocation('/teacher/1')} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                    {t('home_profile')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div><div className="text-4xl font-bold mb-2">10K+</div><p className="text-purple-100">{t('home_active')}</p></div>
            <div><div className="text-4xl font-bold mb-2">500+</div><p className="text-purple-100">{t('home_courses')}</p></div>
            <div><div className="text-4xl font-bold mb-2">200+</div><p className="text-purple-100">{t('home_professors')}</p></div>
            <div><div className="text-4xl font-bold mb-2">4.8★</div><p className="text-purple-100">{t('home_avg')}</p></div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">{t('home_cta_title')}</h2>
          <p className="text-xl text-muted-foreground mb-8">{t('home_cta_sub')}</p>
          <Button onClick={() => setLocation('/register')} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-6 text-lg">
            {t('home_cta_btn')} <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">EduMarket</h3>
              <p className="text-sm">{t('home_hero_sub')}</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">{t('footer_product')}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">{t('nav_courses')}</a></li>
                <li><a href="#" className="hover:text-white">{t('nav_teachers')}</a></li>
                <li><a href="#" className="hover:text-white">{t('nav_community')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">{t('footer_company')}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">{t('footer_about')}</a></li>
                <li><a href="#" className="hover:text-white">{t('footer_blog')}</a></li>
                <li><a href="#" className="hover:text-white">{t('footer_contact')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">{t('footer_legal')}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">{t('footer_privacy')}</a></li>
                <li><a href="#" className="hover:text-white">{t('footer_terms')}</a></li>
                <li><a href="#" className="hover:text-white">{t('footer_cookies')}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>{t('footer_copy')}</p>
          </div>
        </div>
      </footer>
    </PageWrapper>
  );
}
