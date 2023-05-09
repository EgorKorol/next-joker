import React from 'react';
import {JokersForm} from "./components/JokersForm";
import {useBoolean, useEffectOnce, useLocalStorage} from "usehooks-ts";
import {EnterDataForm} from "./components/EnterDataForm";
import {JokersTable} from "./components/JokersTable";
import {Header} from "./components/Header";
import {Joker} from "./types";
import {ALL_JOKERS_KEY} from "./consts";
import {NextJoker} from "./components/NextJoker";
import { ErrorBoundary } from "react-error-boundary";

const startJokers: Joker[] = [
  {name: 'Наташа Л', wasJoking: false},
  {name: 'Наташа Г', wasJoking: false},
  {name: 'Егор К', wasJoking: false},
  {name: 'Егор Д', wasJoking: false},
  {name: 'Петр К', wasJoking: false},
  {name: 'Никита С', wasJoking: false},
];

export function App() {
  const { value: isEditingJokers, setTrue: showJokersForm, setFalse: hideJokersForm } = useBoolean();
  const { value: isEnteringData, setTrue: showEnterDataForm, setFalse: hideEnterDataForm } = useBoolean();
  const { value: isNextJoker, setTrue: showNextJoker, setFalse: hideNextJoker } = useBoolean();
  const [savedJokers, saveJokers] = useLocalStorage<Joker[]>(ALL_JOKERS_KEY, []);

  useEffectOnce(() => {
    if (savedJokers.length === 0) {
      saveJokers(startJokers);
    }
  })

  const openEditing = () => {
    hideEnterDataForm();
    showJokersForm();
  };

  const openEntering = () => {
    hideJokersForm();
    showEnterDataForm();
  };

  const startAgain = () => {
    // eslint-disable-next-line no-restricted-globals
    const yes = confirm('Все кто пошутил - снова будут доступны для выбора');

    if (yes) {
      saveJokers(savedJokers.map((j) => ({...j, wasJoking: false})))
    }
  };

  const copyJokers = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(savedJokers));
      alert('Данные скопированы в буфер')
    } catch (err) {
      alert('Не удается скопировать автоматически. Скопируйте из localStorage самостоятельно')
    }
  };

  const startFromZero = () => {
    localStorage.removeItem(ALL_JOKERS_KEY);
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  }

  return (
      <>
        <Header onStartAgain={startAgain} onEditJokers={openEditing} onCopy={copyJokers} onEnter={openEntering} onNextJoker={showNextJoker} />
        <ErrorBoundary fallback={<p style={{textAlign: 'center', margin: '32px', fontSize: '22px'}}>Произошла какая-то лютая ошибка <button type="button" onClick={startFromZero}>Начать всё заново</button></p>}>
          <div className="wrapper">
            {isEditingJokers && <JokersForm onClose={hideJokersForm}/>}
            {isEnteringData && <EnterDataForm onClose={hideEnterDataForm}/>}
            {isNextJoker && <NextJoker onClose={hideNextJoker} />}
            <JokersTable/>
          </div>
        </ErrorBoundary>
      </>
  );
}
