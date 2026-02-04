import React from 'react';

type DeleteAlertProps = {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

const DeleteAlert: React.FC<DeleteAlertProps> = ({ open, onConfirm, onCancel }) => {
    if (!open) return null;

    return (
        <div className="overlay">
            <div className="close-alert-modal">
                <h2>Excluir?</h2>
                <p>Deseja mesmo excluir o arquivo? Se não tiver uma cópia, ele será perdido para sempre.</p>
                <div className="close-alert-actions">
                    <button onClick={onCancel} className="close-alert-cancel-btn">Cancelar</button>
                    <button onClick={onConfirm} className="close-alert-confirm-btn">
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteAlert;