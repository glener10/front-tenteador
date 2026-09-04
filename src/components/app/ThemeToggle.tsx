import { useTheme } from "../../hooks/useTheme";

export function ThemeToggle() {
  const { mode, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      className="t-icon-btn"
      onClick={toggleTheme}
      data-sound="none"
      title={mode === "dark" ? "Mudar para modo claro" : "Mudar para modo escuro"}
      aria-label={mode === "dark" ? "Mudar para modo claro" : "Mudar para modo escuro"}
    >
      {mode === "dark" ? "☀️" : "🌙"}
    </button>
  );
}