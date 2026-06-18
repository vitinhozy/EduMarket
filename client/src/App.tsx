import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LangProvider } from "./contexts/LangContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Payment from "./pages/Payment";
import TeacherProfile from "./pages/TeacherProfile";
import Community from "./pages/Community";
import Courses from "./pages/Courses";
import AuthSuccess from "./pages/AuthSuccess";
import Profile from "./pages/Profile";
import Matriculas from "./pages/Matriculas";
import Favoritos from "./pages/Favoritos";
import Mensagens from "./pages/Mensagens";
import Notificacoes from "./pages/Notificacoes";
import Carrinho from "./pages/Carrinho";
import Configuracoes from "./pages/Configuracoes";
import Anuncios from "./pages/Anuncios";
import MeusAnuncios from "./pages/MeusAnuncios";
import MinhaAgenda from "./pages/MinhaAgenda";

import MeusCursos from "./pages/MeusCursos";


function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/payment" component={Payment} />
      <Route path="/teacher/:id" component={TeacherProfile} />
      <Route path="/community" component={Community} />
      <Route path="/courses" component={Courses} />
      <Route path="/auth/success" component={AuthSuccess} />
      <Route path="/profile" component={Profile} />
      <Route path="/matriculas" component={Matriculas} />
      <Route path="/favoritos" component={Favoritos} />
      <Route path="/mensagens" component={Mensagens} />
      <Route path="/notificacoes" component={Notificacoes} />
      <Route path="/carrinho" component={Carrinho} />
      <Route path="/settings" component={Configuracoes} />
      <Route path="/anuncios" component={Anuncios} />
      <Route path="/meus-anuncios" component={MeusAnuncios} />
      <Route path="/minha-agenda" component={MinhaAgenda} />

      <Route path="/meus-cursos" component={MeusCursos} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
