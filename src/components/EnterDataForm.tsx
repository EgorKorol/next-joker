import {ReactElement} from "react";
import {useForm} from "react-hook-form";
import {useLocalStorage} from "usehooks-ts";
import {Joker} from "../types";
import {ALL_JOKERS_KEY, START_JOKERS} from "../consts";

interface Props {
    onClose: () => void;
}

interface Form {
    rawData: string;
}

export function EnterDataForm({onClose}: Props): ReactElement {
    const [, saveJokers] = useLocalStorage<Joker[]>(ALL_JOKERS_KEY, []);
    const {register, formState, handleSubmit} = useForm<Form>({
        defaultValues: {rawData: ''}
    });

    const submit = (form: Form) => {
        try {
            const parsed = JSON.parse(form.rawData);
            saveJokers(parsed);
            onClose();
        } catch (e) {
            alert('Некорректные данные')
        }
    };

    const setStartState = () => {
        saveJokers(START_JOKERS);
        onClose();
    }

    return (
        <form onSubmit={handleSubmit(submit)}>
            <div className="form-header">
                <h1>Вставка сохраненных ранее данных</h1>
                <button type="button" onClick={onClose}>Закрыть</button>
            </div>
            <textarea {...register('rawData', {required: true})} />
            <div className="form-actions">
                <button type="button" onClick={setStartState}>Установить дефолтное состояние 🏦</button>
                <button type="submit" disabled={!formState.isValid}>Сохранить 💾</button>
            </div>
        </form>
    )
}