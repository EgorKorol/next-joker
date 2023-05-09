import {useBoolean, useLocalStorage, useTimeout} from "usehooks-ts";
import {Joker} from "../types";
import {ALL_JOKERS_KEY} from "../consts";
import {useMemo, useState} from "react";

interface Props {
    onClose: () => void;
}

export function NextJoker({onClose}: Props) {
    const [skippedJokers, setSkippedJokers] = useState<Joker[]>([]);
    const [savedJokers, saveJokers] = useLocalStorage<Joker[]>(ALL_JOKERS_KEY, []);
    const { value: isNextJoker, setTrue: showNextJoker } = useBoolean();

    useTimeout(showNextJoker, 3500);

    const leftJokers = useMemo(() => savedJokers.filter(({
                                                             wasJoking,
                                                             name
                                                         }) => !wasJoking && skippedJokers.every((s) => s.name !== name)), [savedJokers, skippedJokers]);

    const nextJoker = useMemo(() => {
        if (leftJokers.length === 0) {
            return {name: 'Больше шутников нет, давайте заново', wasJoking: false};
        }

        return leftJokers[Math.floor(leftJokers.length * Math.random())]
    }, [leftJokers]);

    const moveToJokedList = () => {
        setSkippedJokers((old) => [...old, nextJoker]);
    };

    const apply = () => {
        if (leftJokers.length !== 0) {
            saveJokers(savedJokers.map((j) => j.name === nextJoker.name ? ({...j, wasJoking: true}) : j))
        }

        onClose();
    }

    return (
        <div className="abs">
            {!isNextJoker && <div className="animation">Анимация</div>}
            {isNextJoker && <div className="box">
                <div className="abs-joker">{nextJoker.name}</div>
                <div className="abs-actions">
                    <button type="button" onClick={onClose}>Закрыть</button>
                    <button type="button" onClick={apply}>Класс 👍</button>
                    <button type="button" onClick={moveToJokedList}>Пропустить ⏭️</button>
                </div>
            </div>}
        </div>
    )
}