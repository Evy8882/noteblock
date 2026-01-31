import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import File from "../types/File";

export default function Index() {
  const [blocks, setBlocks] = useState<Array<File>>([]);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const response = await invoke<Array<File>>("get_all_files");
        setBlocks(response.reverse());
      } catch (error) {
        alert("Erro ao carregar os blocos:" + error);
      }
    };
    fetchBlocks();
  }, []);

  const navigate = useNavigate();
  return (
    <div className="container dark-theme">
      <header>
        <h1>Seus blocos:</h1>
      </header>
      <div className="actions-bar">
        <button
          className="confirm-btn"
          onClick={() => {
            navigate("/new-block");
          }}
        >
          Novo bloco
        </button>
      </div>
      <div className="files-list">
        {blocks.map((block, index) => (
          <div className="file-item" key={index}>
            <h2>{block.title}</h2>
            <p>Última modificação: { new Date(block.last_modified).toLocaleString()}</p>
            <div className="file-actions">
              <button
                className="confirm-btn"
                onClick={() => {
                  navigate("/edit");
                }}
              >
                Editar
              </button>
              <button className="danger-btn">Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
