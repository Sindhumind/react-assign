type ConfirmModalProps = {
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="modal-overlay">
      <div className="confirm-modal">
        <h2>Confirm Delete</h2>

        <p>Are you sure you want to delete this user?</p>

        <div className="modal-actions">
          <button className="btn" onClick={onCancel}>
            No
          </button>

          <button className="btn btn-delete" onClick={onConfirm}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
