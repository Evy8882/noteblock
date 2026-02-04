import React from 'react';

type CloseAlertProps = {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

const CloseAlert: React.FC<CloseAlertProps> = ({ open, onConfirm, onCancel }) => {
    if (!open) return null;

    return (
        <div className="overlay">
            <div className="close-alert-modal">
                <h2>Fechar arquivo?</h2>
                <p>Todas as mudanças não salvas serão excluídas. Deseja mesmo fechar o arquivo?</p>
                <div className="close-alert-actions">
                    <button onClick={onCancel} className="close-alert-cancel-btn">Cancelar</button>
                    <button onClick={onConfirm} className="close-alert-confirm-btn">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CloseAlert;