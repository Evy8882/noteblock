import { useNavigate } from "react-router-dom"
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useTranslation } from "react-i18next";

export default function CreateBlock() {
    const [title, setTitle] = useState("");
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleCreateBlock = async () => {
        try {
            await invoke("create_file", { title });
            navigate("/");
        } catch (error) {
            alert(t("createBlock.error") + error);
        }
    }

    return (
        <div className="container dark-theme">
            <header>
                <h1>{t("createBlock.header")}</h1>
            </header>
            <div className="edit-file-form">
                <label htmlFor="file-title">{t("createBlock.label")}</label>
                <input
                    type="text"
                    id="file-title"
                    name="file-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <div className="form-actions">
                    <button className="confirm-btn" onClick={handleCreateBlock}>
                        {t("createBlock.save")}
                    </button>
                    <button className="cancel-btn" onClick={() => { navigate("/"); }}>
                        {t("createBlock.cancel")}
                    </button>
                </div>
            </div>
        </div>
    )
}