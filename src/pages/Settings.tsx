import Settings from "../types/Settings";
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Settings>({
    theme: "dark",
    autosave: false,
    show_line_numbers: false,
    language: "en",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [t] = useTranslation();

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const fetchedSettings = await invoke<Settings>("get_settings");
      if (fetchedSettings) {
        setSettings(fetchedSettings);
      }
    } catch (error) {
      alert(t("settings.error_loading") + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (loading) return;
    handleSaveSettings();
  }, [settings.language, settings.theme, settings.autosave, settings.show_line_numbers]);

  const handleSaveSettings = async () => {
    try {
      const savedSettings = await invoke<Settings>("save_settings", {
        settings,
      });
      setSettings(savedSettings);
    } catch (error) {
      alert(t("settings.error_saving") + error);
    }
  };

  if (loading) {
    return <div className={`container ${settings.theme}-theme`}>{t("loading")}</div>;
  }

  return (
    <div className={`container ${settings.theme}-theme`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSaveSettings();
          navigate("/");
          location.reload();
        }}
        className="settings-form"
      >
      <h1>{t("settings.title")}</h1>
        <div className="form-group">
          <label htmlFor="theme">{t("settings.theme")}</label>
          <select
            id="theme"
            value={settings.theme}
            onChange={(e) =>
              setSettings({
                ...settings,
                theme: e.target.value as Settings["theme"],
              })
            }
          >
            <option value="dark">{t("settings.theme_dark")}</option>
            <option value="light">{t("settings.theme_light")}</option>
          </select>
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={settings.autosave}
              onChange={(e) =>
                setSettings({ ...settings, autosave: e.target.checked })
              }
            />
            {t("settings.autosave")}
          </label>
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={settings.show_line_numbers}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  show_line_numbers: e.target.checked,
                })
              }
            />
            {t("settings.show_line_numbers")}
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="language">{t("settings.language")}</label>
          <select
            id="language"
            value={settings.language}
            onChange={(e) =>
              setSettings({ ...settings, language: e.target.value })
            }
          >
            <option value="en">{t("settings.language_en")}</option>
            <option value="pt">{t("settings.language_pt")}</option>
            <option value="es">{t("settings.language_es")}</option>
          </select>
        </div>
        <button type="submit" className="save-btn">
          {t("settings.save")}
        </button>
      </form>
    </div>
  );
}
