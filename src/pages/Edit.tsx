import { useNavigate } from "react-router-dom"
import { useState } from "react";

export default function EditFile() {
    const [title, setTitle] = useState("Título do arquivo 1");
    const [content, setContent] = useState("Conteúdo do arquivo 1");
    const navigate = useNavigate();
    return (
        <div className="container dark-theme">
            <header>
                <h1>Editar arquivo:</h1>
            </header>
            <div className="edit-file-form">
                <label htmlFor="file-title">Título do arquivo:</label>
                <input
                type="text" id="file-title" name="file-title" value={title} onChange={(e) => setTitle(e.target.value)} />
                
                <label htmlFor="file-content">Conteúdo do arquivo:</label>
                <textarea id="file-content" name="file-content" rows={10} value={content} onChange={(e) => setContent(e.target.value)}></textarea>
                
                <div className="form-actions">
                    <button className="confirm-btn">Salvar</button>
                    <button className="cancel-btn" onClick={() => { navigate("/"); }}>Cancelar</button>
                    <button className="danger-btn" onClick={() => { navigate("/"); }}>Excluir</button>
                </div>
            </div>
        </div>
    )
}