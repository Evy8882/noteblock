import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./resources";
import { invoke } from "@tauri-apps/api/core";
import Settings from "../types/Settings";

const get_language = async () => {
    const response = await invoke<Settings>("get_settings");
    if (!response) {
        return "en";
    }
    const language = response.language || "en";
    return language;

}

i18n.use(initReactI18next).init({
  resources,
  lng: await get_language(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;