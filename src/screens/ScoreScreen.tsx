import { useEffect, useRef, useState } from "react";
import { Confetti } from "../components/Confetti";
import { NameEditModal } from "../components/NameEditModal";
import {
  appendEvent,
  finalizeMatch,
  MAX_TEAM_NAME_LENGTH,
  matchScore,
  persistMatch,
  renameTeam,
  startNewMatch,
  teamLabel,
  toggleFavorite,
  type MatchRecord,
} from "../services/matchHistory";

const MAX_SCORE = 24;
const TURN_POINTS = 12;
const FOOTER_POINTS = 18;
const TRUCO_POINTS = 2;
const RETRUCO_POINTS = 3;
const VALE_4_POINTS = 4;
const ENVIDO_POINTS = 2;
const REAL_POINTS = 3;
const REAL_5_POINTS = 5;
const FLOR_POINTS = 3;

type TeamName = "us" | "them";

type Props = {
  match: MatchRecord;
  onExit: () => void;
  onMatchChange: (match: MatchRecord) => void;
};

export function ScoreScreen({ match, onExit, onMatchChange }: Props) {
  const sessionRef = useRef<MatchRecord>(match);
  const [scores, setScores] = useState<Record<TeamName, number>>(() => matchScore(match));
  const [renameTeamName, setRenameTeamName] = useState<TeamName | null>(null);

  useEffect(() => {
    sessionRef.current = match;
  }, [match]);

  const recordEvent = (team: TeamName, action: string, points: number) => {
    const next = appendEvent(sessionRef.current, team, action, points);
    sessionRef.current = next;
    onMatchChange(next);
    persistMatch(next);
  };

  const adjust = (team: TeamName, delta: number, action: string) => {
    recordEvent(team, action, delta);
    setScores((current) => ({
      ...current,
      [team]: Math.min(MAX_SCORE, Math.max(0, current[team] + delta)),
    }));
  };

  const resetMatch = () => {
    const next = startNewMatch(sessionRef.current);
    sessionRef.current = next;
    onMatchChange(next);
    setScores({ us: 0, them: 0 });
  };

  const saveTeamName = (name: string) => {
    if (!renameTeamName) return;
    const next = renameTeam(sessionRef.current, renameTeamName, name);
    sessionRef.current = next;
    onMatchChange(next);
    persistMatch(next);
    setRenameTeamName(null);
  };

  const toggleMatchFavorite = () => {
    const next = toggleFavorite(sessionRef.current);
    sessionRef.current = next;
    onMatchChange(next);
    persistMatch(next);
  };

  const winner =
    scores.us >= MAX_SCORE
      ? teamLabel(match, "us")
      : scores.them >= MAX_SCORE
        ? teamLabel(match, "them")
        : null;

  useEffect(() => {
    if (winner) {
      const next = finalizeMatch(sessionRef.current);
      sessionRef.current = next;
      onMatchChange(next);
      persistMatch(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner]);

  const showFooter = scores.us >= FOOTER_POINTS || scores.them >= FOOTER_POINTS;

  const anyTurned = scores.us >= TURN_POINTS || scores.them >= TURN_POINTS;
  const usFalto = anyTurned ? MAX_SCORE - scores.them : TURN_POINTS - scores.us;
  const themFalto = anyTurned ? MAX_SCORE - scores.us : TURN_POINTS - scores.them;

  return (
    <div className="t-score">
      <div className="t-favorite-row">
        <button
          type="button"
          className="t-favorite-btn"
          onClick={toggleMatchFavorite}
          aria-label={match.favorite ? "Desfavoritar partida" : "Favoritar partida"}
          aria-pressed={!!match.favorite}
        >
          <span className={match.favorite ? "t-star t-star-on" : "t-star"}>
            {match.favorite ? "★" : "☆"}
          </span>
          <span>Favoritar</span>
        </button>
      </div>

      <div className="t-board">
        <TeamScore
          label={teamLabel(match, "us")}
          score={scores.us}
          disabled={winner !== null}
          onEditLabel={() => setRenameTeamName("us")}
          onIncrease={() => adjust("us", 1, "Ponto")}
          onDecrease={() => adjust("us", -1, "Desconto")}
          onTruco={() => adjust("us", TRUCO_POINTS, "Truco")}
          onRetruco={() => adjust("us", RETRUCO_POINTS, "Retruco")}
          onVale4={() => adjust("us", VALE_4_POINTS, "Vale 4")}
          onEnvido={() => adjust("us", ENVIDO_POINTS, "Envido")}
          onReal3={() => adjust("us", REAL_POINTS, "Real")}
          onReal5={() => adjust("us", REAL_5_POINTS, "Real")}
          faltoPoints={usFalto}
          onFalto={() => adjust("us", usFalto, "Falto envido")}
          onFlor={() => adjust("us", FLOR_POINTS, "Flor")}
        />
        <div className="t-board-divider" />
        <TeamScore
          label={teamLabel(match, "them")}
          score={scores.them}
          disabled={winner !== null}
          onEditLabel={() => setRenameTeamName("them")}
          onIncrease={() => adjust("them", 1, "Ponto")}
          onDecrease={() => adjust("them", -1, "Desconto")}
          onTruco={() => adjust("them", TRUCO_POINTS, "Truco")}
          onRetruco={() => adjust("them", RETRUCO_POINTS, "Retruco")}
          onVale4={() => adjust("them", VALE_4_POINTS, "Vale 4")}
          onEnvido={() => adjust("them", ENVIDO_POINTS, "Envido")}
          onReal3={() => adjust("them", REAL_POINTS, "Real")}
          onReal5={() => adjust("them", REAL_5_POINTS, "Real")}
          faltoPoints={themFalto}
          onFalto={() => adjust("them", themFalto, "Falto envido")}
          onFlor={() => adjust("them", FLOR_POINTS, "Flor")}
        />
      </div>

      {showFooter ? <div className="t-score-hint">Se está jogando em trios, não tem mais testa.</div> : null}

      {winner ? (
        <>
          <div className="t-overlay">
            <div className="t-overlay-emoji">🏆</div>
            <div className="t-overlay-title">{winner} venceram!</div>
            <button type="button" className="t-btn t-btn-cta t-overlay-btn" onClick={resetMatch}>
              Nova partida
            </button>
            <button
              type="button"
              className="t-btn t-btn-outline t-overlay-btn t-overlay-btn-secondary"
              onClick={onExit}
            >
              Menu
            </button>
          </div>
          <Confetti />
        </>
      ) : null}

      <NameEditModal
        visible={renameTeamName !== null}
        title="Nome do time"
        caption="Dê um nome para identificar este time."
        placeholder="Ex.: Nós, Eles, Os Guris..."
        initialValue={renameTeamName ? teamLabel(match, renameTeamName) : ""}
        maxLength={MAX_TEAM_NAME_LENGTH}
        inputAccessibilityLabel="Nome do time"
        onClose={() => setRenameTeamName(null)}
        onSave={saveTeamName}
      />
    </div>
  );
}

function TeamScore({
  label,
  score,
  disabled,
  onEditLabel,
  onIncrease,
  onDecrease,
  onTruco,
  onRetruco,
  onVale4,
  onEnvido,
  onReal3,
  onReal5,
  faltoPoints,
  onFalto,
  onFlor,
}: {
  label: string;
  score: number;
  disabled: boolean;
  onEditLabel: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
  onTruco: () => void;
  onRetruco: () => void;
  onVale4: () => void;
  onEnvido: () => void;
  onReal3: () => void;
  onReal5: () => void;
  faltoPoints: number;
  onFalto: () => void;
  onFlor: () => void;
}) {
  const canIncrease = score < MAX_SCORE && !disabled;
  const canDecrease = score > 0 && !disabled;
  const turned = score >= TURN_POINTS;

  return (
    <div className="t-team">
      <button type="button" className="t-team-label-btn" onClick={onEditLabel} title="Renomear time">
        <span className="t-team-label">{label}</span>
      </button>
      <div className="t-turn-slot">
        {turned ? (
          <span className="t-turn-badge">
            <span className="t-turn-badge-text">Virada!</span>
          </span>
        ) : null}
      </div>
      <div className="t-score-number">{score}</div>

      <div className="t-controls">
        <button type="button" className="t-btn t-btn-outline t-ctrl" onClick={onIncrease} disabled={!canIncrease}>
          +
        </button>
        <button type="button" className="t-btn t-btn-outline t-ctrl" onClick={onDecrease} disabled={!canDecrease}>
          −
        </button>
      </div>

      <div className="t-group">
        <div className="t-group-row">
          <button type="button" className="t-btn t-btn-outline t-aux" onClick={onTruco} disabled={!canIncrease}>
            <span className="t-aux-label">Truco</span>
            <span className="t-aux-points">+{TRUCO_POINTS}</span>
          </button>
          <button type="button" className="t-btn t-btn-outline t-aux" onClick={onRetruco} disabled={!canIncrease}>
            <span className="t-aux-label">Retruco</span>
            <span className="t-aux-points">+{RETRUCO_POINTS}</span>
          </button>
        </div>
        <button type="button" className="t-btn t-btn-outline t-block" onClick={onVale4} disabled={!canIncrease}>
          <span className="t-aux-label">Quero vale 4!</span>
          <span className="t-aux-points">+{VALE_4_POINTS}</span>
        </button>
      </div>

      <div className="t-group">
        <button type="button" className="t-btn t-btn-outline t-block" onClick={onEnvido} disabled={!canIncrease}>
          <span className="t-aux-label">Envido</span>
          <span className="t-aux-points">+{ENVIDO_POINTS}</span>
        </button>
        <div className="t-group-row">
          <button type="button" className="t-btn t-btn-outline t-aux t-aux-flex" onClick={onReal3} disabled={!canIncrease}>
            <span className="t-aux-label">Real</span>
            <span className="t-aux-points">+{REAL_POINTS}</span>
          </button>
          <button type="button" className="t-btn t-btn-outline t-aux t-aux-flex" onClick={onReal5} disabled={!canIncrease}>
            <span className="t-aux-label">Real</span>
            <span className="t-aux-points">+{REAL_5_POINTS}</span>
          </button>
        </div>
        <button
          type="button"
          className="t-btn t-btn-outline t-block"
          onClick={onFalto}
          disabled={!canIncrease || faltoPoints <= 0}
        >
          <span className="t-aux-label">Falto envido!</span>
          <span className="t-aux-points">+{faltoPoints}</span>
        </button>
      </div>

      <button type="button" className="t-btn t-btn-outline t-flor" onClick={onFlor} disabled={!canIncrease}>
        <span className="t-flor-emoji">🌸</span>
        <span className="t-aux-label">Flor</span>
        <span className="t-aux-points">+{FLOR_POINTS}</span>
      </button>
    </div>
  );
}
