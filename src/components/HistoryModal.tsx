import { useCallback, useEffect, useState } from "react";
import {
  clampScore,
  getMatchHistory,
  matchScore,
  persistMatch,
  teamLabel,
  toggleFavorite,
  type MatchEvent,
  type MatchRecord,
} from "../services/matchHistory";
import { Modal } from "./Modal";

type Props = {
  visible: boolean;
  onClose: () => void;
  currentOnly?: boolean;
  currentMatch?: MatchRecord;
  onContinueMatch: (match: MatchRecord) => void;
  onToggleFavorite: (match: MatchRecord) => void;
};

type MatchFilter = "all" | "open" | "finished";
const FILTERS: { value: MatchFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "open", label: "Em andamento" },
  { value: "finished", label: "Finalizadas" },
];

type FavoriteFilter = "all" | "favorite" | "not-favorite";
const FAVORITE_FILTERS: { value: FavoriteFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "favorite", label: "Favoritas" },
  { value: "not-favorite", label: "Não favoritas" },
];

const UTC_3 = "America/Sao_Paulo";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    timeZone: UTC_3,
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    timeZone: UTC_3,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

type EventRow = { event: MatchEvent; scoreUs: number; scoreThem: number };

function buildRows(events: MatchEvent[]): EventRow[] {
  const rows: EventRow[] = [];
  let scoreUs = 0;
  let scoreThem = 0;
  for (const event of events) {
    if (event.team === "us") {
      scoreUs = clampScore(scoreUs + event.points);
    } else {
      scoreThem = clampScore(scoreThem + event.points);
    }
    rows.push({ event, scoreUs, scoreThem });
  }
  return rows;
}

export function HistoryModal({
  visible,
  onClose,
  currentOnly,
  currentMatch,
  onContinueMatch,
  onToggleFavorite,
}: Props) {
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<MatchFilter>("all");
  const [favoriteFilter, setFavoriteFilter] = useState<FavoriteFilter>("all");

  const load = useCallback(() => {
    setMatches(
      currentOnly ? getMatchHistory().filter((match) => !match.endedAt) : getMatchHistory(),
    );
    setSelectedId(null);
    setFilter("all");
    setFavoriteFilter("all");
  }, [currentOnly]);

  useEffect(() => {
    if (visible) {
      load();
    }
  }, [visible, load]);

  const selected = currentOnly
    ? (currentMatch ?? matches[0])
    : selectedId
      ? matches.find((match) => match.id === selectedId)
      : null;

  const visibleMatches = matches.filter((match) => {
    const statusOk =
      filter === "all" ? true : filter === "open" ? !match.endedAt : !!match.endedAt;
    const favoriteOk =
      favoriteFilter === "all"
        ? true
        : favoriteFilter === "favorite"
          ? !!match.favorite
          : !match.favorite;
    return statusOk && favoriteOk;
  });

  const emptyMessage =
    matches.length === 0
      ? "Nenhuma partida registrada ainda."
      : filter === "open"
        ? "Nenhuma partida em andamento."
        : filter === "finished"
          ? "Nenhuma partida finalizada."
          : favoriteFilter === "favorite"
            ? "Nenhuma partida favorita."
            : favoriteFilter === "not-favorite"
              ? "Nenhuma partida não favorita."
              : "Nenhuma partida registrada ainda.";

  const toggleFavoriteMatch = (match: MatchRecord) => {
    const toggled = toggleFavorite(match);
    persistMatch(toggled);
    setMatches((current) => current.map((item) => (item.id === match.id ? toggled : item)));
    if (currentMatch?.id === match.id) {
      onToggleFavorite(toggled);
    }
  };

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
      {selected ? (
        <>
          <div className="t-modal-header">
            {!currentOnly ? (
              <button
                type="button"
                className="t-btn t-btn-outline t-modal-back"
                onClick={() => setSelectedId(null)}
                aria-label="Voltar para lista de partidas"
              >
                ‹
              </button>
            ) : (
              <span className="t-modal-back t-modal-back-spacer" />
            )}
            <span className="t-modal-title t-modal-title-flex">{selected.name ?? "Partida"}</span>
            <button
              type="button"
              className="t-icon-btn"
              onClick={() => toggleFavoriteMatch(selected)}
              aria-label={selected.favorite ? "Desfavoritar partida" : "Favoritar partida"}
              aria-pressed={!!selected.favorite}
            >
              <span className={selected.favorite ? "t-star t-star-on" : "t-star"}>
                {selected.favorite ? "★" : "☆"}
              </span>
            </button>
          </div>
          <div className="t-modal-subheader">
            {formatDate(selected.startedAt)} •{" "}
            {selected.endedAt ? `Fim ${formatTime(selected.endedAt)}` : "Em andamento"}
          </div>
          {selected.events.length === 0 ? (
            <div className="t-modal-scroll">
              <p className="t-modal-empty">Nenhuma pontuação registrada.</p>
            </div>
          ) : (
            <>
              <div className="t-summary-header">
                <span className="t-summary-spacer" />
                <span className="t-summary-team">{teamLabel(selected, "us")}</span>
                <span className="t-summary-team">{teamLabel(selected, "them")}</span>
              </div>
              <div className="t-modal-scroll">
                {buildRows(selected.events).map((row, index) => (
                  <div key={index} className="t-event-row">
                    <span className="t-event-time">{formatTime(row.event.at)}</span>
                    <span className="t-event-text">
                      <span className="t-event-team">{teamLabel(selected, row.event.team)}</span> •{" "}
                      {row.event.action}
                    </span>
                    <span
                      className={
                        row.event.points < 0 ? "t-event-delta t-event-delta-neg" : "t-event-delta"
                      }
                    >
                      {row.event.points < 0 ? row.event.points : `+${row.event.points}`}
                    </span>
                    <span className="t-event-vdivider" />
                    <span className="t-summary-value">{row.scoreUs}</span>
                    <span className="t-summary-value">{row.scoreThem}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="t-modal-title">Histórico de partidas</div>
          <div className="t-filter-block">
            <div className="t-filter-caption">Filtrar por situação</div>
            <div className="t-filter-row">
              {FILTERS.map((item) => {
                const active = filter === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    className={`t-chip ${active ? "t-chip-active" : ""}`}
                    onClick={() => setFilter(item.value)}
                    aria-pressed={active}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="t-filter-block">
            <div className="t-filter-caption">Filtrar por favoritos</div>
            <div className="t-filter-row">
              {FAVORITE_FILTERS.map((item) => {
                const active = favoriteFilter === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    className={`t-chip ${active ? "t-chip-active" : ""}`}
                    onClick={() => setFavoriteFilter(item.value)}
                    aria-pressed={active}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="t-modal-scroll">
            {visibleMatches.length === 0 ? (
              <p className="t-modal-empty">{emptyMessage}</p>
            ) : (
              visibleMatches
                .slice()
                .reverse()
                .map((match) => (
                  <div key={match.id} className="t-match-row-wrap">
                    <button
                      type="button"
                      className="t-match-row"
                      onClick={() => {
                        if (match.endedAt) {
                          setSelectedId(match.id);
                        } else {
                          onContinueMatch(match);
                        }
                      }}
                    >
                      {match.name ? (
                        <span className="t-match-row-title">{match.name}</span>
                      ) : null}
                      <span
                        className={
                          match.name ? "t-match-row-title t-match-row-subtitle" : "t-match-row-title"
                        }
                      >
                        {formatDate(match.startedAt)} •{" "}
                        {match.endedAt ? formatTime(match.endedAt) : "Em andamento"}
                      </span>
                      <span className="t-score-row">
                        <span className="t-team-label">{teamLabel(match, "us")}</span>
                        <span className="t-score-value">{matchScore(match).us}</span>
                        <span className="t-score-sep">|</span>
                        <span className="t-score-value">{matchScore(match).them}</span>
                        <span className="t-team-label">{teamLabel(match, "them")}</span>
                      </span>
                      {match.endedAt ? (
                        <span className="t-finished-badge">
                          <span className="t-finished-dot" />
                          <span className="t-finished-label">Finalizada</span>
                        </span>
                      ) : null}
                    </button>
                    <button
                      type="button"
                      className="t-icon-btn t-match-row-star"
                      onClick={() => toggleFavoriteMatch(match)}
                      aria-label={match.favorite ? "Desfavoritar partida" : "Favoritar partida"}
                      aria-pressed={!!match.favorite}
                    >
                      <span className={match.favorite ? "t-star t-star-on" : "t-star"}>
                        {match.favorite ? "★" : "☆"}
                      </span>
                    </button>
                  </div>
                ))
            )}
          </div>
        </>
      )}
    </Modal>
  );
}
