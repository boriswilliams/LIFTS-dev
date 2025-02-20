import { useEffect, useState } from 'react';
import { View, TextInput } from 'react-native';

import { loadDayName, saveDayName, loadDayExercises } from '../storage/days';
import { hashSet } from '../utils/_types';
import { deleteDay, addDayExercise, deleteDayExercise } from '../storage/both';
import ListItem from '../components/listItem';
import { getStyle, DEFAULT_PADDING } from '../utils/styles';
import { loadExerciseList, loadExerciseName } from '../storage/exercises';
import Button from '../components/button';
import List from '../components/list';
import { screenProps } from './_types';

const move = (index: number, start: number[], setStart: (x: number[]) => void, dest: number[], setDest: (x: number[]) => void) => {
    start = [...start]
    dest = [...dest]
    let item: number | undefined = start[index];
    if (item !== undefined) {
        start.splice(index, 1)
        dest.push(item);
    }
    setStart(start);
    setDest(dest);
}

async function updateDayExercises(day: number, included: number[], excluded: number[], includedSet: hashSet): Promise<void> {
    for (let item of excluded)
        if (item in includedSet)
            await deleteDayExercise(day, item);
    for (let item of included)
        if (!(item in includedSet))
            await addDayExercise(day, item);
}

const DaySettings: React.FC<screenProps> = (props: screenProps) => {
    const [name, setName] = useState('');
    const [includedSet, setIncludedSet] = useState<hashSet>({});
    const [included, setIncluded] = useState<number[]>([]);
    const [excluded, setExcluded] = useState<number[]>([]);
    useEffect(() => {
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
        (async (): Promise<void> => {
            let includedSet: hashSet = await loadDayExercises(props.getProps().day!);
            setIncludedSet(includedSet);
            let exerciseList: number[] = await loadExerciseList();
            let included: number[] = [];
            let excluded: number[] = [];
            for (let item of exerciseList) {
                if (item in includedSet) {
                    included.push(item);
                } else {
                    excluded.push(item);
                }
            }
            setIncluded(included);
            setExcluded(excluded);
        })();
    }, []);
    return (
        <View style={{flex: 1}}>
            <TextInput style={[getStyle(), {padding: DEFAULT_PADDING}]} value={name} onChangeText={setName}/>
            <View style={[getStyle(), {flex: 1}, {flexDirection: 'row'}]}>
                <List
                    style={[getStyle(), {flex: 1},]}
                    data={included}
                    ListHeaderComponent={<ListItem text={'included'}/>}
                    renderItem={({index, item}) => {
                        return (
                            <ListItem
                                getText={() => loadExerciseName(item)}
                                onPress={() => {
                                    move(index, included, setIncluded, excluded, setExcluded);
                                }}
                            />
                        )
                    }}
                    keyExtractor={(item) => String(item)}
                />
                <List
                    style={[getStyle(), {flex: 1},]}
                    data={excluded}
                    ListHeaderComponent={<ListItem text={'excluded'}/>}
                    renderItem={({index, item}) => {
                        return (
                            <ListItem
                                getText={() => loadExerciseName(item)}
                                onPress={() => {
                                    move(index, excluded, setExcluded, included, setIncluded);
                                }}
                            />
                        )
                    }}
                    keyExtractor={(item) => String(item)}
                />
            </View>
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