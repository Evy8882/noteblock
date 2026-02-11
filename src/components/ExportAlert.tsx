import { useTranslation } from "react-i18next";
import File from "../types/File";
import { invoke } from "@tauri-apps/api/core";

function ExportAlert({
  open,
  onCancel,
  file,
}: {
  open: boolean;
  onCancel: () => void;
  file: File;
}) {
  const { t } = useTranslation();

  async function handleExport(format: string) {
    await invoke<string>("export_as", { file, format });
    onCancel();
  }

  if (!open) return null;
  return (
    <div className="overlay">
      <div className="close-alert-modal">
        <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
          <h1>{t("select-export-option")}</h1>
          <button className="confirm-btn" onClick={() => handleExport("nbon")}>nbon</button>
          <button className="confirm-btn" onClick={() => handleExport("txt")}>txt</button>
          <button className="confirm-btn" onClick={() => handleExport("md")}>md</button>
          <button className="confirm-btn" onClick={() => handleExport("pdf")}>pdf</button>
          <button className="cancel-btn" onClick={onCancel}>
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExportAlert;
