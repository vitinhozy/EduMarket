import React, { createContext, useContext, useState, useCallback } from 'react';
import { translations, type Lang, type TranslationKey } from '@/lib/i18n';

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem('lang') as Lang) || 'pt';
  });

  const setLang = useCallback((newLang: Lang) => {
    localStorage.setItem('lang', newLang);
    setLangState(newLang);
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    return (translations[lang] as any)?.[key] ?? (translations.pt as any)[key] ?? key;
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
