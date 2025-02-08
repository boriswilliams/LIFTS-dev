import { useEffect, useState } from 'react';
import { View, TextInput, FlatList } from 'react-native';

import { loadDayName, saveDayName, loadDayExercises } from '../storage/days';
import { hashSet, screenProps } from '../utils/types';
import { deleteDay, addDayExercise, deleteDayExercise } from '../storage/both';
import ListItem from '../components/listItem';
import { getStyle } from '../utils/styles';
import { loadExerciseList, loadExerciseName } from '../storage/exercises';
import Button from '../components/button';

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
                        delete: async () => { await deleteDay(props.getProps().day!) },
                        getName: async () => await loadDayName(props.getProps().day!),
                        backDistance: 3,
                    });
                    props.newPage('Delete');
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
            <TextInput style={[getStyle(), {fontSize: 15, padding: 5}]} value={name} onChangeText={setName}/>
            <View style={[getStyle(), {flex: 1}, {flexDirection: 'row'}]}>
                <FlatList
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
                />
                <FlatList
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