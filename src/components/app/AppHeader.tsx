import { ThemeToggle } from "./ThemeToggle";

type Props = {
  title?: string;
  onBack?: () => void;
  onOpenHistory?: () => void;
  onTitlePress?: () => void;
};

export function AppHeader({ title, onBack, onOpenHistory, onTitlePress }: Props) {
  return (
    <header className="t-header">
      <div className="t-header-side">
        {onBack ? (
          <button type="button" className="t-btn t-btn-outline" onClick={onBack}>
            ‹ Menu
          </button>
        ) : null}
      </div>
      <div className="t-header-center">
        {title ? (
          onTitlePress ? (
            <button
              type="button"
              className="t-title-btn"
              onClick={onTitlePress}
              title="Renomear partida"
            >
              {title}
            </button>
          ) : (
            <span className="t-title">{title}</span>
          )
        ) : null}
      </div>
      <div className="t-header-right">
        {onOpenHistory ? (
          <button
            type="button"
            className="t-icon-btn"
            onClick={onOpenHistory}
            aria-label="Abrir histórico"
          >
            ☰
          </button>
        ) : null}
        <ThemeToggle />
      </div>
    </header>
  );
}