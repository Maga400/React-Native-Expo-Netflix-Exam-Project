import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "./locales/en.json";
import az from "./locales/az.json";
import ru from "./locales/ru.json";
import de from "./locales/de.json";

const resources = {
  en: { translation: en },
  az: { translation: az },
  ru: { translation: ru },
  de: { translation: de },
};

const LANGUAGE_KEY = "appLanguage";

const getStoredLanguage = async () => {
  try {
    const lang = await AsyncStorage.getItem(LANGUAGE_KEY);
    return lang;
  } catch (e) {
    console.log("Dil oxunarkən xəta:", e);
    return null;
  }
};

const initI18n = async () => {
  const storedLang = await getStoredLanguage();
  const defaultLanguage = storedLang || "en";
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: defaultLanguage,
      fallbackLng: "en",
      interpolation: {
        escapeValue: false,
      },
    });
};

initI18n();

export const changeLanguage = async (lang) => {
  try {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  } catch (e) {
    console.log("Error while changing language:", e);
  }
};

export default i18n;
