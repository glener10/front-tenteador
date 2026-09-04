import menuClickSound from "../../assets/sounds/menu_click.mp3";
import minusSound from "../../assets/sounds/minus.mp3";
import plusSound from "../../assets/sounds/plus.mp3";
import victorySound from "../../assets/sounds/victory.mp3";

export type SoundName = "menu" | "plus" | "minus" | "victory";

const FILES: Record<SoundName, string> = {
    menu: menuClickSound,
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
