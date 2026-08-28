import qrCode from "../../assets/qr-code.png";
import { Modal } from "./Modal";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function DonateModal({ visible, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      footer={
        <button type="button" className="t-btn t-btn-cta t-modal-close" onClick={onClose}>
          Fechar
        </button>
      }
    >
      <div className="t-modal-title">Ajude o dev a comprar café ☕</div>
      <p className="t-modal-text">
        Se você gosta do jogo, considere doar qualquer valor. Cada xícara de café ajuda o dev a
        seguir melhorando o app!
      </p>
      <div className="t-qr-wrap">
        <img src={qrCode} alt="QR Code Pix para doação" className="t-qr" />
      </div>
      <p className="t-modal-text">
        Abra o app do seu banco e escaneie o QR Code da chave Pix para fazer sua doação.
      </p>
    </Modal>
  );
}
