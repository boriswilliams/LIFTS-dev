import { useEffect, useState } from 'react';
import { View, TextInput, Pressable, Text } from 'react-native';
import Checkbox from 'expo-checkbox';

import { loadExerciseType, loadExerciseName, loadExerciseMinRepRec, loadExerciseMaxRepRec, saveExerciseName, loadExerciseDelta, saveExerciseMinRepRec, saveExerciseMaxRepRec, saveExerciseType, saveExerciseDelta, TYPES, loadExerciseMuscles, loadExerciseBodyAssisted, saveExerciseBodyAssisted, saveExerciseStack, saveExerciseMaxWeight, loadExerciseStack, loadExerciseMaxWeight } from '../storage/exercises';
import { deleteExercise } from '../storage/allExercises';
import Selector from '../components/selector';
import InputNum from '../components/inputNum';
import Button from '../components/button';
import { getStyle, DEFAULT_PADDING } from '../utils/styles';
import { screenProps } from './_types';
import { MAX_REPS } from './exercise/_helpers';
import { updateParentItems } from '../components/includer';
import { hashSet } from '../utils/_types';
import { deleteExerciseMuscle, addExerciseMuscle } from '../storage/muscleExercises';
import { loadStackData, loadStackList, loadStackName, saveNewStack } from '../storage/stacks';
import Item from '../components/item';

const ExerciseSettings: React.FC<screenProps> = (props: screenProps) => {
    const [name, setName] = useState<string>('');
    const [minRepRec, setMinRepRec] = useState<string>(String(0));
    const [maxRepRec, setMaxRepRec] = useState<string>(String(MAX_REPS));
    const [type, setType] = useState(0);
    const [delta, setDelta] = useState<string>(String(0));
    const [bodyAssisted, setBodyAssisted] = useState<boolean>(false);
    const [stacks, setStacks] = useState<number[]>([]);
    const [stackNames, setStackNames] = useState<string[]>([]);
    const [stackIndex, setStackIndex] = useState<number>(-1);
    const [maxWeight, setMaxWeight] = useState<string>('100');
    const [stackData, setStackData] = useState<number[]>([]);
    async function updateExerciseMuscles(included: number[], excluded: number[], includedSet: hashSet): Promise<void> {
        updateParentItems(props.getProps().exercise!, included, excluded, includedSet, deleteExerciseMuscle, addExerciseMuscle);
    }
    useEffect(() => {
        props.makeSwitchButton();
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
        loadExerciseBodyAssisted(props.getProps().exercise!).then(result => setBodyAssisted(result));
        loadStackList().then(setStacks);
        loadExerciseMaxWeight(props.getProps().exercise!).then(maxWeight => setMaxWeight(String(maxWeight)));
    }, []);
    useEffect(() => {
        loadExerciseStack(props.getProps().exercise!).then(stack => {
            setStackIndex(stacks.indexOf(stack));
        });
        (async () => {
            let names: string[] = [];
            for (let stack of stacks) {
                names.push(await loadStackName(stack));
            }
            return names;
        })().then(setStackNames);
    }, [stacks]);
    useEffect(() => {
        loadStackData(stacks[stackIndex]).then(setStackData);
    }, [stackIndex]);
    const style = getStyle();
    return (
        <View style={[getStyle(), {flex: 1}]}>
            <TextInput style={[getStyle(), {padding: DEFAULT_PADDING}]} value={name} onChangeText={setName}/>
            <Button
                title={'Select muscles'}
                onPress={async (): Promise<void> => {
                    props.newProps({
                        loadIncluded: async () => await loadExerciseMuscles(props.getProps().exercise!),
                        updateMuscles: updateExerciseMuscles
                    });
                    props.newPage('MuscleSelect');
                }}
            />
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
            <View style={{flex: 1}}>
                {(TYPES[type] === 'delta' || TYPES[type] === 'body') &&
                    <InputNum
                        value={delta}
                        changeValue={setDelta}
                        title={'Delta'}
                        min={0}
                        delta={0.25}
                        decimals={true}
                    />
                }
                {(TYPES[type] === 'body') &&
                    <Pressable
                        style={[style, {flexDirection: 'row', alignItems: 'center', paddingLeft: DEFAULT_PADDING}]}
                        onPress={() => setBodyAssisted(value => !value)}
                    >
                        <Checkbox
                            value={bodyAssisted}
                        />
                        <Text style={[style, {padding: DEFAULT_PADDING}]}>{'Suggest assisted'}</Text>
                    </Pressable>
                }
                {(TYPES[type] === 'custom') && <View>
                    <InputNum
                        key={'max_weight'}
                        value={maxWeight}
                        changeValue={setMaxWeight}
                        title={'Max weight'}
                        delta={1}
                        decimals={true}
                    />
                    <View>
                        <Item text={"New stack"}
                            onPress={async (): Promise<void> => {
                                let newStack = await saveNewStack();
                                props.newProps({
                                    stack: newStack,
                                    backDisabled: props.backDisabled,
                                });
                                props.disableBack!(true);
                                props.newPage('Stack');
                            }}
                            style={[style, {color: style.accent}]}
                        />
                    </View>
                    <Selector
                        key={'stack_select'}
                        selected={stackIndex}
                        setSelected={setStackIndex}
                        data={stackNames}
                    />
                    <Text
                        key={'stack_data'}
                        style={[style, {fontFamily: 'monospace', paddingLeft: 5, flex: 1}]}
                    >{stackData.join()}</Text>
                </View>}
            </View>
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
                    if (TYPES[type] === 'delta' || TYPES[type] === 'body')
                        await saveExerciseDelta(props.getProps().exercise!, Number(delta));
                    if (TYPES[type] === 'body')
                        await saveExerciseBodyAssisted(props.getProps().exercise!, bodyAssisted);
                    if (TYPES[type] === 'custom') {
                        await saveExerciseMaxWeight(props.getProps().exercise!, Number(maxWeight));
                        await saveExerciseStack(props.getProps().exercise!, stacks[stackIndex]);
                    }
                }}
            />
        </View>
    );
}

export default ExerciseSettings;