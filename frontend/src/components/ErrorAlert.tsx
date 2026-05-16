interface ErrorAlertProps {
  message: string;
  onClose?: () => void;
}

export default function ErrorAlert({ message, onClose }: ErrorAlertProps) {
  return (
    <div
      className="alert alert-danger"
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
