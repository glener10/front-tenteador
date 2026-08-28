import type { ReactNode } from "react";

type Props = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export function Modal({ visible, onClose, children, footer }: Props) {
  if (!visible) return null;
  return (
    <div className="t-modal-backdrop">
      <div className="t-modal-backdrop-touch" onClick={onClose} aria-hidden="true" />
      <div className="t-modal-card" role="dialog" aria-modal="true">
        <div className="t-modal-body">{children}</div>
        {footer}
      </div>
    </div>
  );
}
