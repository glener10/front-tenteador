import iconDark from "../../assets/icon_dark_v2.png";
import iconLight from "../../assets/icon_light_v2.png";
import { useTheme } from "../hooks/useTheme";

type Props = {
  onStartMatch: () => void;
  onOpenHistory: () => void;
};

export function HomeScreen({ onStartMatch, onOpenHistory }: Props) {
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
      </div>
    </div>
  );
}