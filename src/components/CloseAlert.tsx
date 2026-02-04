import React from 'react';
import { useTranslation } from 'react-i18next';

type CloseAlertProps = {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

const CloseAlert: React.FC<CloseAlertProps> = ({ open, onConfirm, onCancel }) => {
    if (!open) return null;
    const { t } = useTranslation();

    return (
        <div className="overlay">
            <div className="close-alert-modal">
                <h2>{t("closeAlert.header")}</h2>
                <p>{t("closeAlert.message")}</p>
                <div className="close-alert-actions">
                    <button onClick={onCancel} className="close-alert-cancel-btn">{t("closeAlert.cancel")}</button>
                    <button onClick={onConfirm} className="close-alert-confirm-btn">
                        {t("closeAlert.confirm")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CloseAlert;