import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Navigation } from '@/components/Navigation';
import { useLang } from '@/contexts/LangContext';
import { PageWrapper } from '@/components/PageWrapper';
import { PlayCircle, Clock, BookOpen, Users, Star, Download, Share2, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface Lesson {
  id: string;
  title: string;
  duration: number;
  watched: boolean;
  order: number;
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  description: string;
  rating: number;
  students: number;
  price: number;
  thumbnail: string;
  level: string;
  duration: number;
  lessons: Lesson[];
}

export default function Courses() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const courses: Course[] = [
    {
      id: '1',
      title: 'React Avançado',
      instructor: 'João Silva',
      description: 'Domine React com hooks, context API, performance optimization e muito mais.',
      rating: 4.9,
      students: 245,
      price: 99.90,
      thumbnail: 'React',
      level: 'Avançado',
      duration: 32,
      lessons: [
        { id: '1-1', title: 'Introdução ao React 18', duration: 45, watched: true, order: 1 },
        { id: '1-2', title: 'Hooks Avançados', duration: 60, watched: true, order: 2 },
        { id: '1-3', title: 'Context API e State Management', duration: 55, watched: false, order: 3 },
        { id: '1-4', title: 'Performance Optimization', duration: 50, watched: false, order: 4 },
        { id: '1-5', title: 'Testing React Components', duration: 65, watched: false, order: 5 },
      ]
    },
    {
      id: '2',
      title: 'Node.js Masterclass',
      instructor: 'João Silva',
      description: 'Crie aplicações backend escaláveis com Node.js, Express e MongoDB.',
      rating: 4.8,
      students: 189,
      price: 129.90,
      thumbnail: 'Node.js',
      level: 'Intermediário',
      duration: 40,
      lessons: [
        { id: '2-1', title: 'Fundamentos do Node.js', duration: 50, watched: true, order: 1 },
        { id: '2-2', title: 'Express Framework', duration: 60, watched: false, order: 2 },
        { id: '2-3', title: 'MongoDB e Mongoose', duration: 70, watched: false, order: 3 },
        { id: '2-4', title: 'Autenticação e Autorização', duration: 55, watched: false, order: 4 },
      ]
    },
    {
      id: '3',
      title: 'TypeScript Completo',
      instructor: 'João Silva',
      description: 'Aprenda TypeScript do zero e escreva código mais seguro e mantível.',
      rating: 4.7,
      students: 156,
      price: 89.90,
      thumbnail: 'TypeScript',
      level: 'Iniciante',
      duration: 28,
      lessons: [
        { id: '3-1', title: 'Tipos Básicos', duration: 40, watched: true, order: 1 },
        { id: '3-2', title: 'Interfaces e Types', duration: 50, watched: false, order: 2 },
        { id: '3-3', title: 'Genéricos', duration: 45, watched: false, order: 3 },
      ]
    },
  ];

  const handleWatchLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    toast.success(`Assistindo: ${lesson.title}`);
  };

  const handleDownloadMaterial = () => {
    toast.success('Material baixado com sucesso!');
  };

  return (
    <PageWrapper>
      <Navigation />
      <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Meus Cursos
          </h1>
          <p className="text-gray-600">Acesse seus cursos e continue aprendendo</p>
        </div>

        {selectedCourse ? (
          // Course Detail View
          <div className="space-y-6">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCourse(null);
                setSelectedLesson(null);
              }}
              className="mb-4"
            >
              ← Voltar aos Cursos
            </Button>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Video Player */}
              <div className="md:col-span-2">
                <Card>
                  <CardContent className="pt-6">
                    <div className="bg-gray-900 rounded-lg h-96 flex items-center justify-center mb-6">
                      <div className="text-center">
                        <PlayCircle className="w-16 h-16 text-white mx-auto mb-4" />
                        <p className="text-white">
                          {selectedLesson ? selectedLesson.title : 'Selecione uma aula'}
                        </p>
                      </div>
                    </div>

                    {selectedLesson && (
                      <div>
                        <h2 className="text-2xl font-bold mb-2">{selectedLesson.title}</h2>
                        <div className="flex items-center gap-4 text-gray-600 mb-6">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {selectedLesson.duration} minutos
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            Aula {selectedLesson.order}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                            <Download className="w-4 h-4 mr-2" />
                            Baixar Material
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <Share2 className="w-4 h-4 mr-2" />
                            Compartilhar
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Course Sidebar */}
              <div className="md:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>{selectedCourse.title}</CardTitle>
                    <CardDescription>{selectedCourse.instructor}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold">{selectedCourse.rating}</span>
                      <span className="text-gray-600">({selectedCourse.students} alunos)</span>
                    </div>

                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700">Progresso do Curso</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">2 de 5 aulas concluídas</p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Aulas</h3>
                      <div className="space-y-2">
                        {selectedCourse.lessons.map(lesson => (
                          <button
                            key={lesson.id}
                            onClick={() => handleWatchLesson(lesson)}
                            className={`w-full text-left p-3 rounded-lg transition-colors ${
                              selectedLesson?.id === lesson.id
                                ? 'bg-purple-100 border-l-4 border-purple-600'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {lesson.watched ? (
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              ) : (
                                <PlayCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{lesson.title}</p>
                                <p className="text-xs text-gray-500">{lesson.duration} min</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          // Courses List View
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="h-40 bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">{course.thumbnail}</span>
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-bold mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{course.instructor}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold">{course.rating}</span>
                      <span className="text-gray-600">({course.students} alunos)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {course.duration} horas
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="w-4 h-4" />
                      {course.lessons.length} aulas
                    </div>
                  </div>

                  <div className="bg-purple-50 p-3 rounded-lg mb-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Progresso</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                        style={{ width: `${(course.lessons.filter(l => l.watched).length / course.lessons.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedCourse(course);
                      setSelectedLesson(course.lessons[0]);
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    Continuar Aprendendo
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
    </PageWrapper>
  );
}
