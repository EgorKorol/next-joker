import React from "react";
import {useLocalStorage} from "usehooks-ts";
import {Joker} from "../types";
import {ALL_JOKERS_KEY} from "../consts";

export function JokersTable() {
    const [savedJokers, saveJokers] = useLocalStorage<Joker[]>(ALL_JOKERS_KEY, []);

    const moveToJokedList = (jokerName: string) => () => {
        saveJokers(savedJokers.map((j) => j.name === jokerName ? ({...j, wasJoking: true}) : j))
    };

    const moveToNotJokedList = (jokerName: string) => () => {
        saveJokers(savedJokers.map((j) => j.name === jokerName ? ({...j, wasJoking: false}) : j))
    };

    return <table className="table">
        <thead>
        <tr>
            <th>Не шутили</th>
            <th>Пошутили</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>
                <ul>
                    {
                        savedJokers.filter(({ wasJoking }) => !wasJoking).map(({name}) => (
                            <li key={name}>{name} <button type="button" onClick={moveToJokedList(name)}>➡️</button></li>
                        ))
                    }
                </ul>
            </td>

            <td>
                <ul>
                    {
                        savedJokers.filter(({ wasJoking }) => wasJoking).map(({name}) => (
                            <li key={name}><button type="button" onClick={moveToNotJokedList(name)}>⬅️</button>️ {name}</li>
                        ))
                    }
                </ul>
            </td>
        </tr>
        </tbody>
    </table>;
}