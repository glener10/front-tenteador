import { useState } from "react";
import { AppHeader } from "./components/app/AppHeader";
import { AppFooter } from "./components/app/AppFooter";
import { HistoryModal } from "./components/HistoryModal";
import { NameEditModal } from "./components/NameEditModal";
import { RulesModal } from "./components/RulesModal";
import { DonateModal } from "./components/DonateModal";
import { ThemeProvider } from "./hooks/useTheme";
import { SoundProvider, useSound } from "./hooks/useSound";
import { HomeScreen } from "./screens/HomeScreen";
import { ScoreScreen } from "./screens/ScoreScreen";
import {
  createMatch,
  MAX_NAME_LENGTH,
  persistMatch,
  renameMatch,
  type MatchRecord,
} from "./services/matchHistory";

type Screen = "home" | "match";

function AppContent() {
  const [screen, setScreen] = useState<Screen>("home");
  const [activeMatch, setActiveMatch] = useState<MatchRecord | null>(null);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const [nameOpen, setNameOpen] = useState(false);
  const { play } = useSound();

  const startMatch = () => {
    play("start");
    setActiveMatch(createMatch());
    setScreen("match");
  };

  const openHistory = () => {
    play("history");
    setHistoryOpen(true);
  };

  return (
    <div className="t-shell">
      <AppHeader
        title={screen === "match" ? (activeMatch?.name ?? "Partida") : undefined}
        onBack={screen === "match" ? () => setScreen("home") : undefined}
        onOpenHistory={screen === "match" ? openHistory : undefined}
        onTitlePress={screen === "match" ? () => setNameOpen(true) : undefined}
      />
      <div className="t-main">
        {screen === "home" ? (
          <HomeScreen onStartMatch={startMatch} onOpenHistory={openHistory} />
        ) : activeMatch ? (
          <ScoreScreen
            match={activeMatch}
            onMatchChange={setActiveMatch}
            onExit={() => setScreen("home")}
          />
        ) : null}
      </div>
      <AppFooter
        onOpenAbout={() => setRulesOpen(true)}
        onOpenDonate={() => setDonateOpen(true)}
      />

      <RulesModal visible={rulesOpen} onClose={() => setRulesOpen(false)} />
      <DonateModal visible={donateOpen} onClose={() => setDonateOpen(false)} />
      <NameEditModal
        visible={nameOpen}
        title="Nome da partida"
        caption="Dê um nome para identificar esta partida no histórico."
        placeholder="Ex.: Final com os guris"
        initialValue={activeMatch?.name ?? ""}
        maxLength={MAX_NAME_LENGTH}
        inputAccessibilityLabel="Nome da partida"
        onClose={() => setNameOpen(false)}
        onSave={(name) => {
          if (activeMatch) {
            const renamed = renameMatch(activeMatch, name);
            setActiveMatch(renamed);
            persistMatch(renamed);
          }
          setNameOpen(false);
        }}
      />
      <HistoryModal
        visible={historyOpen}
        onClose={() => setHistoryOpen(false)}
        currentOnly={screen === "match"}
        currentMatch={activeMatch ?? undefined}
        onContinueMatch={(match) => {
          setHistoryOpen(false);
          setActiveMatch(match);
          setScreen("match");
        }}
        onToggleFavorite={(match) => {
          setActiveMatch((current) => (current?.id === match.id ? match : current));
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SoundProvider>
        <AppContent />
      </SoundProvider>
    </ThemeProvider>
  );
}