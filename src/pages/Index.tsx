import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import File from "../types/File";
import { useTranslation } from "react-i18next";
import Settings from "../types/Settings";

export default function Index() {
  const [blocks, setBlocks] = useState<Array<File>>([]);
  const [settings, setSettings] = useState<Settings>(
    {
      theme: "dark",
      autosave: false,
      show_line_numbers: false,
      language: "en",
    }
  );
  const navigate = useNavigate();

  const { t } = useTranslation();

  const fetchSettings = async () => {
    try {
      const settings = await invoke<Settings>("get_settings");
      if (!settings) {
        navigate("/settings");
      }else {
        setSettings(settings);
      }
    } catch (error) {
      alert(t("error_loading_settings") + error);
    }
  };

  const fetchBlocks = async () => {
    try {
      const response = await invoke<Array<File>>("get_all_files");
      setBlocks(response.reverse());
    } catch (error) {
      alert(t("error_loading_blocks") + error);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchBlocks();
  }, []);

  return (
    <div className={`container ${settings.theme}-theme`}>
      <header>
        <h1>{t("your_blocks")}</h1>
      </header>
      <div className="actions-bar">
        <button
          className="confirm-btn"
          onClick={() => {
            navigate("/new-block");
          }}
        >
          {t("new_block")}
        </button>
        <button
          className="secondary-btn"
          onClick={() => {
            navigate("/settings");
          }}
        >
          {t("settings")}
        </button>
      </div>
      <div className="files-list">
        {blocks.map((block, index) => (
          <div className="file-item" key={index}>
            <h2>{block.title}</h2>
            <p>
              {t("last_modified")}: {new Date(block.last_modified).toLocaleString()}
            </p>
            <div className="file-actions">
              <button
                className="confirm-btn"
                onClick={() => {
                  navigate(`/edit/${block.id}`);
                }}
              >
                {t("edit")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
