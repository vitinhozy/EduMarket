import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Navigation } from '@/components/Navigation';
import { useLang } from '@/contexts/LangContext';
import { PageWrapper } from '@/components/PageWrapper';
import { Heart, MessageCircle, Share2, Search, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  liked: boolean;
  image?: string;
}

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Maria Silva',
      avatar: 'MS',
      content: 'Finalmente consegui dominar React Hooks! Que jornada incrível. Recomendo o curso do João Silva para todos que querem aprender.',
      timestamp: '2 horas atrás',
      likes: 45,
      comments: 8,
      liked: false,
    },
    {
      id: '2',
      author: 'Pedro Santos',
      avatar: 'PS',
      content: 'Alguém mais acha que TypeScript deveria ser obrigatório em todo projeto? Salva vidas!',
      timestamp: '4 horas atrás',
      likes: 128,
      comments: 32,
      liked: false,
    },
    {
      id: '3',
      author: 'Ana Costa',
      avatar: 'AC',
      content: 'Dica: Sempre faça testes unitários desde o início do projeto. Economiza muito tempo depois!',
      timestamp: '6 horas atrás',
      likes: 89,
      comments: 15,
      liked: false,
    },
  ]);

  const [newPost, setNewPost] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreatePost = () => {
    if (!newPost.trim()) {
      toast.error('Por favor, escreva algo antes de postar');
      return;
    }

    const post: Post = {
      id: Math.random().toString(36).substr(2, 9),
      author: 'Você',
      avatar: 'VE',
      content: newPost,
      timestamp: 'agora',
      likes: 0,
      comments: 0,
      liked: false,
    };

    setPosts([post, ...posts]);
    setNewPost('');
    toast.success('Post criado com sucesso!');
  };

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
  };

  const filteredPosts = posts.filter(post =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageWrapper>
      <Navigation />
      <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Comunidade EduMarket
          </h1>
          <p className="text-gray-600">Compartilhe conhecimento e conecte-se com outros estudantes</p>
        </div>

        {/* Create Post */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">VE</span>
              </div>
              <div className="flex-1">
                <Textarea
                  placeholder="O que você está pensando? Compartilhe suas dúvidas, dicas ou conquistas!"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline">
                    Adicionar Imagem
                  </Button>
                  <Button
                    onClick={handleCreatePost}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Postar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">{post.avatar}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{post.author}</p>
                        <p className="text-sm text-gray-500">{post.timestamp}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">⋯</Button>
                  </div>

                  {/* Post Content */}
                  <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>

                  {post.image && (
                    <div className="mb-4 bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                      <span className="text-gray-400">Imagem</span>
                    </div>
                  )}

                  {/* Post Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4 pb-4 border-b">
                    <span>{post.likes} curtidas</span>
                    <span>{post.comments} comentários</span>
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLikePost(post.id)}
                      className={post.liked ? 'text-red-500' : 'text-gray-600'}
                    >
                      <Heart className={`w-5 h-5 mr-2 ${post.liked ? 'fill-red-500' : ''}`} />
                      Curtir
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-gray-600">
                          <MessageCircle className="w-5 h-5 mr-2" />
                          Comentar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Adicionar Comentário</DialogTitle>
                          <DialogDescription>
                            Compartilhe seu pensamento sobre este post
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{post.content}</p>
                          </div>
                          <Textarea
                            placeholder="Escreva seu comentário..."
                            rows={3}
                            className="resize-none"
                          />
                          <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                            Comentar
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="sm" className="text-gray-600">
                      <Share2 className="w-5 h-5 mr-2" />
                      Compartilhar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-600">Nenhum post encontrado. Seja o primeiro a postar!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
    </PageWrapper>
  );
}
