import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "en" | "th";

type LangState = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
};

export const useLang = create<LangState>()(
  persist(
    (set, get) => ({
      lang: "en",
      setLang: (lang) => set({ lang }),
      toggle: () => set({ lang: get().lang === "en" ? "th" : "en" }),
    }),
    { name: "sxb-lang" },
  ),
);
