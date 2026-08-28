import iconDark from "../../assets/icon_dark_v2.png";
import iconLight from "../../assets/icon_light_v2.png";
import { useTheme } from "../theme";

type Props = {
  onStartMatch: () => void;
  onOpenAbout: () => void;
  onOpenHistory: () => void;
  onOpenDonate: () => void;
};

export function HomeScreen({ onStartMatch, onOpenAbout, onOpenHistory, onOpenDonate }: Props) {
  const { mode } = useTheme();
  const icon = mode === "dark" ? iconDark : iconLight;

  return (
    <div className="t-home">
      <div className="t-home-body">
        <img src={icon} alt="Tenteador" className="t-home-icon" />
        <div className="t-divider" />
        <button type="button" className="t-btn t-btn-cta" onClick={onStartMatch}>
          Nova partida
        </button>
        <button type="button" className="t-btn t-btn-menu" onClick={onOpenHistory}>
          Histórico de partidas
        </button>
        <button type="button" className="t-btn t-btn-menu" onClick={onOpenAbout}>
          Sobre o jogo
        </button>
      </div>
      <button type="button" className="t-donate" onClick={onOpenDonate}>
        <span className="t-donate-icon">☕</span>
        <span>Ajude o dev a comprar café</span>
      </button>
    </div>
  );
}
