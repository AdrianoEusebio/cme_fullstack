import "./style.css";

interface PopupMessageProps {
  type: "success" | "error" | "alert" | "info";
  message: string;
  onClose: () => void;
}

function PopupMessage({ type, message, onClose }: PopupMessageProps) {
  return (
    <div className={`popup ${type}-popup`}>
      <div className={`popup-icon ${type}-icon`}>
        {type === "success" && (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="success-svg">
            <path
              fillRule="evenodd"
              d="m12 1c-6.075 0-11 4.925-11 11s4.925 11 11 11 11-4.925 11-11-4.925-11-11-11zm4.768 9.14..."
              clipRule="evenodd"
            />
          </svg>
        )}
        {type === "error" && (
          <svg className="error-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10..."
              clipRule="evenodd"
            />
          </svg>
        )}
        {type === "alert" && (
          <svg className="alert-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334..."
              clipRule="evenodd"
            />
          </svg>
        )}
        {type === "info" && (
          <svg className="info-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0..."
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>

      <div className={`${type}-message`}>{message}</div>

      <div className="popup-icon close-icon" onClick={onClose}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="close-svg">
          <path
            d="m15.8333 5.34166-1.175-1.175-4.6583 4.65834-4.65833-4.65834-1.175 1.175 4.65833 4.65834-4.65833 4.6583 1.175 1.175 4.65833-4.6583 4.6583 4.6583 1.175-1.175-4.6583-4.6583z"
            className="close-path"
          />
        </svg>
      </div>
    </div>
  );
}

export default PopupMessage;
