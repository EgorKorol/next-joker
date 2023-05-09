import React from "react";
import {useLocalStorage} from "usehooks-ts";
import {Joker} from "../types";
import {ALL_JOKERS_KEY} from "../consts";

interface Props {
    onStartAgain: () => void;
    onEditJokers: () => void;
    onCopy: () => void;
    onEnter: () => void;
    onNextJoker: () => void;
}

export function Header({onStartAgain, onEditJokers, onCopy, onEnter, onNextJoker}: Props) {
    const [savedJokers] = useLocalStorage<Joker[]>(ALL_JOKERS_KEY, []);

    return <header className="header">
        <nav>
            <ul className="actions">
                <li>
                    <button type="button" disabled={!savedJokers.length} onClick={onNextJoker}>Выбрать шутника</button>
                </li>
                <li>
                    <button type="button" onClick={onStartAgain}>Начать сначала</button>
                </li>
                <li>
                    <button type="button" onClick={onEditJokers}>Редактировать список участников
                    </button>
                </li>
                <li>
                    <button type="button" onClick={onCopy}>Скопировать текущее состояние</button>
                </li>
                <li>
                    <button type="button" onClick={onEnter}>Вставить сохраненное состояние</button>
                </li>
            </ul>
        </nav>
    </header>;
}