import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LANGUAGE_OPTIONS, mergeLanguageState, normalizeLang, type Lang } from "./locale.mjs";

export { LANGUAGE_OPTIONS, isLang, normalizeLang, htmlLang } from "./locale.mjs";
export type { Lang } from "./locale.mjs";

type LangState = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
};

export const useLang = create<LangState>()(
  persist(
    (set, get) => ({
      lang: "en",
      setLang: (lang) => set({ lang: normalizeLang(lang) }),
      toggle: () => {
        const index = LANGUAGE_OPTIONS.findIndex((option) => option.code === get().lang);
        set({ lang: LANGUAGE_OPTIONS[(index + 1) % LANGUAGE_OPTIONS.length].code });
      },
    }),
    {
      name: "sxb-lang",
      version: 0,
      partialize: (state) => ({ lang: state.lang }),
      merge: mergeLanguageState,
      // Start SSR and the first browser render in the same language.
      // RootDocument rehydrates the saved preference after React mounts.
      skipHydration: true,
    },
  ),
);
