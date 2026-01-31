import { useNavigate } from "react-router-dom"
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function CreateBlock() {
    const [title, setTitle] = useState("");
    const navigate = useNavigate();

    const handleCreateBlock = async () => {
        try {
            await invoke("create_file", { title });
            navigate("/");
        } catch (error) {
            alert("Erro ao criar o bloco:" + error);
        }
    }

    return (
        <div className="container dark-theme">
            <header>
                <h1>Criar novo bloco:</h1>
            </header>
            <div className="edit-file-form">
                <label htmlFor="file-title">Título do bloco:</label>
                <input
                type="text" id="file-title" name="file-title" value={title} onChange={(e) => setTitle(e.target.value)} />
                
                <div className="form-actions">
                    <button className="confirm-btn" onClick={() => {handleCreateBlock()}}>Salvar</button>
                    <button className="cancel-btn" onClick={() => { navigate("/"); }}>Cancelar</button>                </div>
            </div>
        </div>
    )
}