import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Settings, Trash2, Moon, Sun, Globe } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { t, languages, getLang, setLang, type Lang } from '@/lib/i18n';

export default function Configuracoes() {
  const [, setLocation] = useLocation();
  const [usuario, setUsuario] = useState<any>(null);
  const { theme, toggleTheme } = useTheme();
  const [langAtual, setLangAtual] = useState<Lang>(getLang());

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { setLocation('/login'); return; }
    setUsuario(JSON.parse(stored));
  }, []);

  const handleDeleteAccount = () => {
    if (!confirm(t('settings_delete_confirm'))) return;
    localStorage.removeItem('user');
    toast.success(t('settings_deleted'));
    setLocation('/');
  };

  const handleLang = (code: Lang) => {
    setLangAtual(code);
    setLang(code);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{t('settings_title')}</h1>

        {/* Aparência */}
        <Card className="shadow-md mb-4 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base dark:text-white">
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              {t('settings_appearance')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-800 dark:text-white text-sm">{t('settings_dark_mode')}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {theme === 'dark' ? t('settings_dark_on') : t('settings_dark_off')}
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${theme === 'dark' ? 'bg-purple-600' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => theme === 'dark' && toggleTheme?.()}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${theme === 'light' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'}`}
              >
                <Sun className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium dark:text-white">{t('settings_light')}</span>
              </button>
              <button
                onClick={() => theme === 'light' && toggleTheme?.()}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${theme === 'dark' ? 'border-purple-600 bg-purple-900' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <Moon className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium dark:text-white">{t('settings_dark')}</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Idioma */}
        <Card className="shadow-md mb-4 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base dark:text-white">
              <Globe className="w-5 h-5" />
              {t('settings_language')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{t('settings_choose_lang')}</p>
            <div className="grid grid-cols-2 gap-3">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleLang(lang.code as Lang)}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                    langAtual === lang.code
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-900'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="text-sm font-medium dark:text-white">{lang.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conta */}
        <Card className="shadow-md dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base dark:text-white">
              <Settings className="w-5 h-5" /> {t('settings_account')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <div>
                <p className="font-medium text-gray-800 dark:text-white text-sm">{t('settings_connected')}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{usuario?.email}</p>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-sm font-medium text-red-500 mb-2">{t('settings_danger')}</p>
              <Button
                variant="outline"
                onClick={handleDeleteAccount}
                className="border-red-300 text-red-500 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {t('settings_delete')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
