import { useEffect, useRef } from "react";

type ConfirmModalProps = {
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    const previousActiveElement = document.activeElement as HTMLElement | null;

    cancelButtonRef.current?.focus();
function handleKeyDown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    event.preventDefault();
    onCancel();
    return;
  }

  if (event.key !== "Tab") return;

  const currentDialog = dialogRef.current;

  if (!currentDialog) return;

  const focusableElements = currentDialog.querySelectorAll<HTMLElement>(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  );

  if (focusableElements.length === 0) {
    event.preventDefault();
    currentDialog.focus();
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      if (previousActiveElement?.isConnected) {
        previousActiveElement.focus();
      }
    };
  }, [onCancel]);

  return (
    <div className="modal-overlay">
      <div
        ref={dialogRef}
        className="confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-description"
        tabIndex={-1}
      >
        <h2 id="confirm-delete-title">Confirm Delete</h2>

        <p id="confirm-delete-description">
          Are you sure you want to delete this user?
        </p>

        <div className="modal-actions">
          <button
            ref={cancelButtonRef}
            className="btn"
            type="button"
            onClick={onCancel}
          >
            No
          </button>

          <button className="btn btn-delete" type="button" onClick={onConfirm}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}