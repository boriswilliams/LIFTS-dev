import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { View, TextInput } from 'react-native';

import { loadDayName, saveDayName, loadDayExercises, loadDayMuscles, loadDayMuscleList } from '../storage/days';
import { hashSet } from '../utils/_types';
import { addDayExercise, deleteDayExercise } from '../storage/dayExercises';
import { deleteDay } from '../storage/allExercises';
import { getStyle, DEFAULT_PADDING } from '../utils/styles';
import { loadExerciseList, loadExerciseName } from '../storage/exercises';
import Button from '../components/button';
import { screenProps } from './_types';
import Includer, { updateParentItems, getLists } from '../components/includer';
import { deleteDayMuscle, addDayMuscle } from '../storage/dayMuscles';
import { loadMuscleExerciseList } from '../storage/muscles';

async function updateDayExercises(day: number, included: number[], excluded: number[], includedSet: hashSet): Promise<void> {
    updateParentItems(day, included, excluded, includedSet, deleteDayExercise, addDayExercise);
}

const DaySettings: React.FC<screenProps> = (props: screenProps) => {
    const [name, setName] = useState('');
    const [includedSet, setIncludedSet] = useState<hashSet>({});
    const [included, setIncluded] = useState<number[]>([]);
    const [excluded, setExcluded] = useState<number[]>([]);
    const [excludedTitle, setExcludedTitle] = useState<string>('');
    const updateDayMuscles = useCallback(async (included: number[], excluded: number[], includedSet: hashSet) =>
        updateParentItems(props.getProps().day!, included, excluded, includedSet, deleteDayMuscle, addDayMuscle)
    , []);
    useEffect(() => {
        props.makeSwitchButton();
        props.setHeaderRight(
            <Button
                title={'Delete'}
                onPress={() => {
                    props.newProps({
                        execute: async () => { await deleteDay(props.getProps().day!) },
                        getName: async () => await loadDayName(props.getProps().day!),
                        backDistance: props.backDisabled && 2 || 3,
                        action: 'delete',
                    });
                    props.newPage('Confirm');
                }}
            />
        )
        loadDayName(props.getProps().day!).then(result => {setName(result)});
        loadDayMuscleList(props.getProps().day!).then(muscles => {
            setExcludedTitle(muscles.length === 0 && 'All exercises' || 'Exercises for muscles');
            const loadIncluded = async () => await loadDayExercises(props.getProps().day!);
            const loadAll = async () => {
                let exercises: number[] = [];
                if (muscles.length === 0) {
                    exercises = await loadExerciseList();
                } else {
                    for (let muscle of muscles) {
                        exercises.push(...await loadMuscleExerciseList(muscle));
                    }
                }
                return exercises;
            }
            getLists(loadIncluded, loadAll, setIncludedSet, setIncluded, setExcluded);
        });
    }, []);
    return (
        <View style={{flex: 1}}>
            <TextInput style={[getStyle(), {padding: DEFAULT_PADDING}]} value={name} onChangeText={setName}/>
            <Button
                title={'Select muscles'}
                onPress={async (): Promise<void> => {
                    props.newProps({
                        loadIncluded: async () => await loadDayMuscles(props.getProps().day!),
                        updateMuscles: updateDayMuscles
                    });
                    props.newPage('MuscleSelect');
                }}
            />
            <Includer
                loadName={loadExerciseName}
                included={included}
                setIncluded={setIncluded}
                excluded={excluded}
                setExcluded={setExcluded}
                customExcludedTitle={excludedTitle}
            />
            <Button
                title="Save"
                onPress={async () => {
                    await saveDayName(props.getProps().day!, name)
                    await updateDayExercises(props.getProps().day!, included, excluded, includedSet);
                    props.goBack();
                }}
            />
        </View>
    );
}

export default DaySettings;