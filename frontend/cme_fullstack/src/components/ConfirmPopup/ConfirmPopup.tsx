import React from "react";
import "./ConfirmPopup.css"; // Importa o estilo separado

interface ConfirmPopupProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmPopup: React.FC<ConfirmPopupProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-popup-overlay">
      <div className="confirm-popup-box">
        <p className="confirm-popup-message">{message}</p>
        <div className="confirm-popup-actions">
          <button className="confirm-popup-cancel" onClick={onCancel}>Cancelar</button>
          <button className="confirm-popup-confirm" onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
