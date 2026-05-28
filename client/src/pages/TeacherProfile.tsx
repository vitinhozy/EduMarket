import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Navigation } from '@/components/Navigation';
import { Calendar, Clock, Star, Users, BookOpen, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface ScheduleForm {
  date: string;
  time: string;
  topic: string;
  notes: string;
}

export default function TeacherProfile() {
  const [scheduleForm, setScheduleForm] = useState<ScheduleForm>({
    date: '',
    time: '',
    topic: '',
    notes: '',
  });

  const [appointments, setAppointments] = useState([
    {
      id: '1',
      date: '2024-06-15',
      time: '14:00',
      student: 'Maria Silva',
      topic: 'Aula de JavaScript',
      status: 'confirmed'
    },
  ]);

  const handleScheduleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setScheduleForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!scheduleForm.date || !scheduleForm.time || !scheduleForm.topic) {
      toast.error('Por favor, preencha os campos obrigatórios');
      return;
    }

    const newAppointment = {
      id: Math.random().toString(36).substr(2, 9),
      date: scheduleForm.date,
      time: scheduleForm.time,
      student: 'Você',
      topic: scheduleForm.topic,
      status: 'pending' as const
    };

    setAppointments(prev => [...prev, newAppointment]);
    setScheduleForm({ date: '', time: '', topic: '', notes: '' });
    toast.success('Aula agendada com sucesso!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navigation />
      <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Perfil do Professor
          </h1>
          <p className="text-gray-600">Conheça nossos professores e agende suas aulas</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Teacher Info */}
          <div className="md:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl text-white font-bold">JS</span>
                  </div>
                  <h2 className="text-2xl font-bold">João Silva</h2>
                  <p className="text-purple-600 font-semibold">Especialista em Programação Web</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">4.9</span>
                    <span className="text-gray-600">(128 avaliações)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">342</span>
                    <span className="text-gray-600">alunos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold">15</span>
                    <span className="text-gray-600">cursos</span>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-700">
                    <strong>Valor da hora:</strong> R$ 80,00
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    <strong>Disponibilidade:</strong> Seg-Sex, 14h-20h
                  </p>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold">
                      <Calendar className="w-4 h-4 mr-2" />
                      Agendar Aula
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Agendar Aula com João Silva</DialogTitle>
                      <DialogDescription>
                        Escolha a data, horário e tópico da aula
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleScheduleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Data</Label>
                        <Input
                          id="date"
                          name="date"
                          type="date"
                          value={scheduleForm.date}
                          onChange={handleScheduleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">Horário</Label>
                        <Input
                          id="time"
                          name="time"
                          type="time"
                          value={scheduleForm.time}
                          onChange={handleScheduleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="topic">Tópico da Aula</Label>
                        <Input
                          id="topic"
                          name="topic"
                          placeholder="Ex: React Hooks"
                          value={scheduleForm.topic}
                          onChange={handleScheduleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Observações (opcional)</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          placeholder="Adicione detalhes sobre o que você gostaria de aprender"
                          value={scheduleForm.notes}
                          onChange={handleScheduleChange}
                          rows={3}
                        />
                      </div>
                      <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                        Confirmar Agendamento
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Bio */}
            <Card>
              <CardHeader>
                <CardTitle>Sobre</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Sou desenvolvedor full-stack com mais de 10 anos de experiência em programação web. Especializado em React, Node.js e arquitetura de aplicações escaláveis. Tenho paixão por ensinar e ajudar outros desenvolvedores a crescer na carreira.
                </p>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Aulas Agendadas</CardTitle>
                <CardDescription>Próximas aulas confirmadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {appointments.map(appointment => (
                    <div key={appointment.id} className="flex items-start gap-4 p-3 bg-purple-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-10 h-10 bg-purple-200 rounded-full">
                          <Calendar className="w-5 h-5 text-purple-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{appointment.topic}</p>
                        <p className="text-sm text-gray-600">{appointment.student}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(appointment.date).toLocaleDateString('pt-BR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {appointment.time}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          appointment.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.status === 'confirmed' ? 'Confirmada' : 'Pendente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Courses */}
            <Card>
              <CardHeader>
                <CardTitle>Cursos Disponíveis</CardTitle>
                <CardDescription>Cursos oferecidos por este professor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: 'React Avançado', price: 'R$ 99,90', students: 245 },
                    { title: 'Node.js Masterclass', price: 'R$ 129,90', students: 189 },
                    { title: 'TypeScript Completo', price: 'R$ 89,90', students: 156 },
                    { title: 'GraphQL Essentials', price: 'R$ 109,90', students: 98 },
                  ].map((course, idx) => (
                    <div key={idx} className="p-4 border rounded-lg hover:shadow-lg transition-shadow">
                      <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                      <p className="text-purple-600 font-bold mb-2">{course.price}</p>
                      <p className="text-sm text-gray-600">{course.students} alunos inscritos</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Avaliações</CardTitle>
                <CardDescription>O que os alunos dizem</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { author: 'Maria Silva', rating: 5, comment: 'Excelente professor! Muito didático e atencioso.' },
                    { author: 'Pedro Santos', rating: 5, comment: 'Aulas práticas e bem estruturadas. Recomendo!' },
                    { author: 'Ana Costa', rating: 4, comment: 'Ótimo conteúdo, poderia ter mais exemplos.' },
                  ].map((review, idx) => (
                    <div key={idx} className="pb-4 border-b last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-900">{review.author}</p>
                        <div className="flex gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
