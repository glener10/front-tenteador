import { useSound } from "../../hooks/useSound";

export function SoundToggle() {
  const { enabled, toggleSound } = useSound();
  return (
    <button
      type="button"
      className="t-icon-btn"
      onClick={toggleSound}
      title={enabled ? "Desativar sons" : "Ativar sons"}
      aria-label={enabled ? "Desativar sons" : "Ativar sons"}
      aria-pressed={enabled}
    >
      {enabled ? "🔊" : "🔇"}
    </button>
  );
}
