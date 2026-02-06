import React from 'react';
import { useTranslation } from 'react-i18next';
import { invoke } from '@tauri-apps/api/core';

type DeleteAlertProps = {
    open: boolean;
    fileId: string | undefined;
    onConfirm: () => void;
    onCancel: () => void;
};

const DeleteAlert: React.FC<DeleteAlertProps> = ({ open, fileId, onConfirm, onCancel }) => {
    if (!open) return null;
    const { t } = useTranslation();

    async function handleConfirm() {
        if (!fileId) return;
        await invoke("delete_file", {id: fileId});
        onConfirm();
    }

    return (
        <div className="overlay">
            <div className="close-alert-modal">
                <h2>{t("deleteAlert.header")}</h2>
                <p>{t("deleteAlert.message")}</p>
                <div className="close-alert-actions">
                    <button onClick={onCancel} className="close-alert-cancel-btn">{t("deleteAlert.cancel")}</button>
                    <button onClick={handleConfirm} className="close-alert-confirm-btn">
                        {t("deleteAlert.confirm")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteAlert;