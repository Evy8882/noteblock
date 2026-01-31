import { useNavigate } from "react-router-dom"

export default function Index() {
    const navigate = useNavigate();
    return (
        <div className="container dark-theme">
            <header>
                <h1>Seus blocos:</h1>
            </header>
            <div className="actions-bar">
                <button
                className="confirm-btn"
                onClick={()=>{
                    navigate("/new-block");
                }}
                >Novo bloco</button>
            </div>
            <div className="files-list">
                <div className="file-item">
                    <h2>Título do bloco 1</h2>
                    <p>Última modificação: 2024-06-01</p>
                    <div className="file-actions">
                        <button
                        className="confirm-btn"
                        onClick={()=>{
                            navigate("/edit");
                        }}
                        >Editar</button>
                        <button className="danger-btn">Excluir</button>
                    </div>
                </div>
            </div>
        </div>
    )
}