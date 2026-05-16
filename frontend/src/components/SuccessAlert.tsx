interface SuccessAlertProps {
  message: string;
  onClose?: () => void;
}

export default function SuccessAlert({ message, onClose }: SuccessAlertProps) {
  return (
    <div
      className="alert alert-success"
      style={{ justifyContent: "space-between" }}
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1.2rem",
            color: "inherit",
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
