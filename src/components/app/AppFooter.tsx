type Props = {
  onOpenAbout: () => void;
  onOpenDonate: () => void;
};

export function AppFooter({ onOpenAbout, onOpenDonate }: Props) {
  return (
    <footer className="t-footer">
      <div className="t-footer-inner">
        <button type="button" className="t-footer-btn" onClick={onOpenAbout}>
          Sobre o jogo
        </button>
        <button type="button" className="t-footer-btn" onClick={onOpenDonate}>
          <span className="t-donate-icon">☕</span>
          <span>Ajude o dev a comprar café</span>
        </button>
      </div>
    </footer>
  );
}