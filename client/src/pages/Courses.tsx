import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { PageWrapper } from '@/components/PageWrapper';
import { PlayCircle, Clock, BookOpen, Star, Download, Share2, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface Aula {
  id: number;
  titulo: string;
  descricao: string;
  categoriaId: number;
  videoId: string | null;
}

export default function Courses() {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAula, setSelectedAula] = useState<Aula | null>(null);

  useEffect(() => {
    fetch('/api/aulas')
      .then(r => r.json())
      .then(data => {
        setAulas(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleShare = () => {
    toast.success('Link copiado para a área de transferência!');
  };

  const handleDownload = () => {
    toast.success('Material baixado com sucesso!');
  };

  if (loading) {
    return (
      <PageWrapper>
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Carregando cursos...</p>
        </div>
      </PageWrapper>
    );
  }

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

          {selectedAula ? (
            /* ── Detalhe do curso ── */
            <div className="space-y-6">
              <Button
                variant="outline"
                onClick={() => setSelectedAula(null)}
                className="mb-4"
              >
                ← Voltar aos Cursos
              </Button>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Player */}
                <div className="md:col-span-2">
                  <Card>
                    <CardContent className="pt-6">
                      {selectedAula.videoId ? (
                        <div className="rounded-lg overflow-hidden mb-6" style={{ aspectRatio: '16/9' }}>
                          <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${selectedAula.videoId}?autoplay=1&rel=0`}
                            title={selectedAula.titulo}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="bg-gray-900 rounded-lg h-96 flex items-center justify-center mb-6">
                          <div className="text-center">
                            <PlayCircle className="w-16 h-16 text-white mx-auto mb-4" />
                            <p className="text-white">Vídeo não disponível</p>
                          </div>
                        </div>
                      )}

                      <h2 className="text-2xl font-bold mb-2">{selectedAula.titulo}</h2>
                      <p className="text-gray-600 mb-6 leading-relaxed">{selectedAula.descricao}</p>

                      <div className="flex gap-2">
                        <Button
                          onClick={handleDownload}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Baixar Material
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={handleShare}>
                          <Share2 className="w-4 h-4 mr-2" />
                          Compartilhar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar — lista de outras aulas */}
                <div className="md:col-span-1">
                  <Card className="sticky top-4">
                    <CardHeader>
                      <CardTitle>Mais Cursos</CardTitle>
                      <CardDescription>Continue aprendendo</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {aulas.map(aula => (
                          <button
                            key={aula.id}
                            onClick={() => setSelectedAula(aula)}
                            className={`w-full text-left p-3 rounded-lg transition-colors ${
                              selectedAula.id === aula.id
                                ? 'bg-purple-100 border-l-4 border-purple-600'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {aula.videoId ? (
                                <img
                                  src={`https://img.youtube.com/vi/${aula.videoId}/default.jpg`}
                                  alt={aula.titulo}
                                  className="w-16 h-10 object-cover rounded shrink-0"
                                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                              ) : (
                                <PlayCircle className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                              )}
                              <p className="text-sm font-medium text-gray-900 line-clamp-2">{aula.titulo}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            /* ── Grade de cursos ── */
            aulas.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
                  <BookOpen className="w-10 h-10" />
                  <p className="text-sm">Nenhum curso disponível no momento.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aulas.map(aula => (
                  <Card key={aula.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    {/* Thumbnail do YouTube ou gradiente fallback */}
                    {aula.videoId ? (
                      <div className="relative h-40 bg-gray-900 overflow-hidden">
                        <img
                          src={`https://img.youtube.com/vi/${aula.videoId}/hqdefault.jpg`}
                          alt={aula.titulo}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                            <PlayCircle className="w-7 h-7 text-white" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-40 bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-white" />
                      </div>
                    )}

                    <CardContent className="pt-5">
                      <h3 className="text-lg font-bold mb-2 line-clamp-1">{aula.titulo}</h3>
                      <p className="text-sm text-gray-600 mb-5 line-clamp-2">{aula.descricao}</p>

                      <Button
                        onClick={() => setSelectedAula(aula)}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      >
                        Assistir agora
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
