import { useEffect, useState } from 'react';
import { View, TextInput } from 'react-native';

import { loadExerciseType, loadExerciseName, loadExerciseMinRepRec, loadExerciseMaxRepRec, saveExerciseName, loadExerciseDelta, saveExerciseMinRepRec, saveExerciseMaxRepRec, saveExerciseType, saveExerciseDelta, TYPES } from '../storage/exercises';
import { deleteExercise } from '../storage/both';
import Selector from '../components/selector';
import InputNum from '../components/inputNum';
import Button from '../components/button';
import { getStyle, DEFAULT_PADDING } from '../utils/styles';
import { screenProps } from './_types';
import { MAX_REPS } from './exercise/_helpers';

const ExerciseSettings: React.FC<screenProps> = (props: screenProps) => {
    const [name, setName] = useState<string>('');
    const [minRepRec, setMinRepRec] = useState<string>(String(0));
    const [maxRepRec, setMaxRepRec] = useState<string>(String(MAX_REPS));
    const [type, setType] = useState(0);
    const [delta, setDelta] = useState<string>(String(0));
    useEffect(() => {
        props.setHeaderRight(
            <Button
                title={'Delete'}
                onPress={() => {
                    props.newProps({
                        execute: async () => { await deleteExercise(props.getProps().exercise!) },
                        getName: async () => await loadExerciseName(props.getProps().exercise!),
                        backDistance: props.backDisabled && 2 || 3,
                        action: 'delete',
                    });
                    props.newPage('Confirm');
                }}
            />
        )
        loadExerciseName(props.getProps().exercise!).then(result => {setName(result)});
        loadExerciseMinRepRec(props.getProps().exercise!).then(result => {setMinRepRec(String(result));});
        loadExerciseMaxRepRec(props.getProps().exercise!).then(result => {setMaxRepRec(String(result));});
        loadExerciseType(props.getProps().exercise!).then(result => {
            setType(TYPES.indexOf(result));
        });
        loadExerciseDelta(props.getProps().exercise!).then(result => {setDelta(String(result));});
    }, []);
    return (
        <View style={[getStyle(), {flex: 1}]}>
            <TextInput style={[getStyle(), {padding: DEFAULT_PADDING}]} value={name} onChangeText={setName}/>
            <InputNum
                value={minRepRec}
                changeValue={setMinRepRec}
                title={'Min reps'}
                min={1}
                max={Number(maxRepRec)}
                delta={1}
                decimals={false}
            />
            <InputNum
                value={maxRepRec}
                changeValue={setMaxRepRec}
                title={'Max reps'}
                min={Number(minRepRec)}
                max={MAX_REPS}
                delta={1}
                decimals={false}
            />
            <Selector
                data={TYPES}
                selected={type}
                setSelected={setType}
            />
            {(TYPES[type] == 'delta' || TYPES[type] == 'body') &&
                <InputNum
                    value={delta}
                    changeValue={setDelta}
                    title={'Delta'}
                    min={0}
                    delta={0.25}
                    decimals={true}
                />
            }
            <Button
                title="Save"
                onPress={async () => {
                    await saveExerciseName(props.getProps().exercise!, name);
                    if (Number(minRepRec) < Number(maxRepRec)) {
                        await saveExerciseMinRepRec(props.getProps().exercise!, Number(minRepRec));
                        await saveExerciseMaxRepRec(props.getProps().exercise!, Number(maxRepRec));
                        props.goBack();
                    } else {
                        console.error(`${minRepRec} > ${maxRepRec}`);
                    }
                    await saveExerciseType(props.getProps().exercise!, TYPES[type]);
                    if (TYPES[type] == 'delta' || TYPES[type] == 'body')
                        await saveExerciseDelta(props.getProps().exercise!, Number(delta));
                }}
            />
        </View>
    );
}

export default ExerciseSettings;