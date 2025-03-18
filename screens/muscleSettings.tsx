import { useEffect, useState } from 'react';
import { View, TextInput } from 'react-native';

import { loadMuscleName, saveMuscleName, loadMuscleExercises } from '../storage/muscles';
import { hashSet } from '../utils/_types';
import { addMuscleExercise, deleteMuscleExercise } from '../storage/muscleExercises';
import { deleteMuscle } from '../storage/allExercises';
import { getStyle, DEFAULT_PADDING } from '../utils/styles';
import { loadExerciseList, loadExerciseName } from '../storage/exercises';
import Button from '../components/button';
import { screenProps } from './_types';
import Includer, { getLists } from '../components/includer';

async function updateMuscleExercises(muscle: number, included: number[], excluded: number[], includedSet: hashSet): Promise<void> {
    for (let item of excluded)
        if (item in includedSet)
            await deleteMuscleExercise(muscle, item);
    for (let item of included)
        if (!(item in includedSet))
            await addMuscleExercise(muscle, item);
}

const MuscleSettings: React.FC<screenProps> = (props: screenProps) => {
    const [name, setName] = useState('');
    const [includedSet, setIncludedSet] = useState<hashSet>({});
    const [included, setIncluded] = useState<number[]>([]);
    const [excluded, setExcluded] = useState<number[]>([]);
    useEffect(() => {
        props.makeSwitchButton();
        props.setHeaderRight(
            <Button
                title={'Delete'}
                onPress={() => {
                    props.newProps({
                        execute: async () => { await deleteMuscle(props.getProps().muscle!) },
                        getName: async () => await loadMuscleName(props.getProps().muscle!),
                        backDistance: props.backDisabled && 2 || 3,
                        action: 'delete',
                    });
                    props.newPage('Confirm');
                }}
            />
        )
        loadMuscleName(props.getProps().muscle!).then(result => {setName(result)});
        const loadIncluded = async () => await loadMuscleExercises(props.getProps().muscle!);
        const loadAll = loadExerciseList;
        getLists(loadIncluded, loadAll, setIncludedSet, setIncluded, setExcluded);
    }, []);
    return (
        <View style={[{flex: 1}, getStyle()]}>
            <TextInput style={[getStyle(), {padding: DEFAULT_PADDING}]} value={name} onChangeText={setName}/>
            <Includer
                loadName={loadExerciseName}
                included={included}
                setIncluded={setIncluded}
                excluded={excluded}
                setExcluded={setExcluded}
            />
            <Button
                title="Save"
                onPress={async () => {
                    await saveMuscleName(props.getProps().muscle!, name)
                    await updateMuscleExercises(props.getProps().muscle!, included, excluded, includedSet);
                    props.goBack();
                }}
            />
        </View>
    );
}

export default MuscleSettings;