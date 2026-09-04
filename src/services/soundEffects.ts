import historySound from "../../assets/sounds/history.mp3";
import minusSound from "../../assets/sounds/minus.mp3";
import plusSound from "../../assets/sounds/plus.mp3";
import startSound from "../../assets/sounds/inicio_partida.mp3";
import victorySound from "../../assets/sounds/victory.mp3";

export type SoundName = "start" | "history" | "plus" | "minus" | "victory";

const FILES: Record<SoundName, string> = {
    start: startSound,
    history: historySound,
    plus: plusSound,
    minus: minusSound,
    victory: victorySound,
};

const cache = new Map<SoundName, HTMLAudioElement>();

export function playSound(name: SoundName) {
    let audio = cache.get(name);
    if (!audio) {
        audio = new Audio(FILES[name]);
        cache.set(name, audio);
    }
    audio.currentTime = 0;
    void audio.play().catch(() => {});
}
