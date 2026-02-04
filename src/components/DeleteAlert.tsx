import React from 'react';
import { useTranslation } from 'react-i18next';

type DeleteAlertProps = {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

const DeleteAlert: React.FC<DeleteAlertProps> = ({ open, onConfirm, onCancel }) => {
    if (!open) return null;
    const { t } = useTranslation();

    return (
        <div className="overlay">
            <div className="close-alert-modal">
                <h2>{t("deleteAlert.header")}</h2>
                <p>{t("deleteAlert.message")}</p>
                <div className="close-alert-actions">
                    <button onClick={onCancel} className="close-alert-cancel-btn">{t("deleteAlert.cancel")}</button>
                    <button onClick={onConfirm} className="close-alert-confirm-btn">
                        {t("deleteAlert.confirm")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteAlert;