import { useEffect, useState } from "react";
import { Modal } from "./Modal";

type Props = {
  visible: boolean;
  title: string;
  caption: string;
  placeholder?: string;
  initialValue: string;
  maxLength: number;
  inputAccessibilityLabel: string;
  onClose: () => void;
  onSave: (value: string) => void;
};

export function NameEditModal({
  visible,
  title,
  caption,
  placeholder,
  initialValue,
  maxLength,
  inputAccessibilityLabel,
  onClose,
  onSave,
}: Props) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (visible) {
      setValue(initialValue);
    }
  }, [visible, initialValue]);

  const remaining = maxLength - value.length;

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      footer={
        <div className="t-modal-actions">
          <button type="button" className="t-btn t-btn-outline" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="t-btn t-btn-cta" onClick={() => onSave(value)}>
            Salvar
          </button>
        </div>
      }
    >
      <div className="t-modal-title">{title}</div>
      <div className="t-modal-caption">{caption}</div>
      <input
        className="t-input"
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-label={inputAccessibilityLabel}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
      />
      <div className="t-counter">
        {remaining} de {maxLength}
      </div>
    </Modal>
  );
}
