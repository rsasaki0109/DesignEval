"use client";

import { useLocale } from "./LocaleProvider";

export default function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <button
      type="button"
      onClick={() => setLocale(locale === "ja" ? "en" : "ja")}
      className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      aria-label="Switch language"
    >
      <span className={locale === "ja" ? "font-bold text-gray-900 dark:text-gray-100" : ""}>
        JA
      </span>
      {" / "}
      <span className={locale === "en" ? "font-bold text-gray-900 dark:text-gray-100" : ""}>
        EN
      </span>
    </button>
  );
}
