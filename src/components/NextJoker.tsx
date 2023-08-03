import {useLocalStorage} from "usehooks-ts";
import {Joker} from "../types";
import {ALL_JOKERS_KEY} from "../consts";
import {useMemo, useState, MouseEvent} from "react";

interface Props {
    onClose: () => void;
    onStartAgain: () => void;
}

export function NextJoker({onClose, onStartAgain}: Props) {
    const [skippedJokers, setSkippedJokers] = useState<Joker[]>([]);
    const [savedJokers, saveJokers] = useLocalStorage<Joker[]>(ALL_JOKERS_KEY, []);

    const leftJokers = useMemo(() => savedJokers.filter(({
                                                             wasJoking,
                                                             name
                                                         }) => !wasJoking && skippedJokers.every((s) => s.name !== name)), [savedJokers, skippedJokers]);

    const noJokersLeft = leftJokers.length === 0;
    
    const nextJoker = useMemo(() => {
        if (noJokersLeft) {
            return {name: 'Больше шутников нет, давайте заново', wasJoking: false};
        }

        return leftJokers[Math.floor(leftJokers.length * Math.random())]
    }, [leftJokers, noJokersLeft]);

    const moveToJokedList = () => {
        setSkippedJokers((old) => [...old, nextJoker]);
    };

    const apply = () => {
        if (leftJokers.length !== 0) {
            saveJokers(savedJokers.map((j) => j.name === nextJoker.name ? ({...j, wasJoking: true}) : j))
        }

        onClose();
    }

    const onStart = () => {
        onClose();
        onStartAgain();
    }

    const onBgClose = (e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="abs" onClick={onBgClose}>
            <div className="box">
                <div className="abs-joker">
                    <span className="name-animation">{nextJoker.name.split(' ')[0]}</span>
                    {' '}
                    <span className="surname-animation">{nextJoker.name.split(' ')[1]}</span>
                </div>
                <div className={`abs-actions${noJokersLeft ? ' abs-actions--center' : ''}`}>
                    {
                        noJokersLeft ?
                            <button type="button" onClick={onStart}>Начать заново</button>
                            : <>
                                <button type="button" onClick={apply}>Подтвердить 👍</button>
                                <button type="button" onClick={moveToJokedList}>Пропустить ⏭️</button>
                            </>
                    }
                </div>
            </div>
        </div>
    )
}