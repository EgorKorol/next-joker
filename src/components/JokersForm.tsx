import {ReactElement} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {useLocalStorage} from "usehooks-ts";
import {ALL_JOKERS_KEY} from "../consts";
import {Joker} from "../types";

interface Props {
    onClose: () => void;
}

interface Form {
    jokers: Joker[];
}

export function JokersForm({onClose}: Props): ReactElement {
    const [savedJokers, saveJokers] = useLocalStorage<Joker[]>(ALL_JOKERS_KEY, []);
    const {register, control, formState, handleSubmit} = useForm<Form>({
        defaultValues: {jokers: savedJokers}
    });
    const {fields, append, remove} = useFieldArray({
        control,
        name: 'jokers'
    });

    const submit = ({jokers}: Form) => {
        saveJokers(jokers);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit(submit)}>
            <div className="form-header">
                <h1>Редактирование списка участников</h1>
                <button type="button" onClick={onClose}>Закрыть</button>
            </div>
            <ul className="inputs">
                {fields.map((field, index) => (
                    <li key={field.id}>
                        <input type="text" {...register(`jokers.${index}.name`, { required: true })} />
                        <button type="button" onClick={() => remove(index)}>Удалить</button>
                    </li>
                ))}
            </ul>
            <div className="form-actions">
                <button type="button" onClick={() => append({ name: '', wasJoking: false })}>Добавить шутника</button>
                <button type="submit" disabled={!formState.isValid}>Сохранить</button>
            </div>
        </form>
    )
}