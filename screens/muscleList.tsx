import { useEffect, useState } from 'react';

import { loadMuscleList, saveNewMuscle, loadMuscleName, loadMuscleExerciseList } from '../storage/muscles';
import { loadExerciseList, saveNewExercise } from '../storage/exercises';
import { addMuscleExercise } from '../storage/muscleExercises';
import { getStyle, globalStyle } from '../utils/styles';
import Item from '../components/item';
import Button from '../components/button';
import List from '../components/list';
import { screenProps } from './_types';

const MuscleList: React.FC<screenProps> = (props: screenProps) => {
    const [muscleList, setMuscleList] = useState<number[]>([]);
    useEffect((): void => {
        props.disableBack!(false);
        props.makeSwitchButton('Workouts', 'DayList');
        props.setHeaderRight(
            <Button
                title={'Profile'}
                onPress={() => {
                    props.newProps({});
                    props.newPage('Profile');
                }}
            />
        )
        loadMuscleList().then((result: number[]): void => { setMuscleList(result) });
        props.setTitle('Muscles');
    }, []);
    return (
        <List
            style={[getStyle(), {flex: 1},]}
            data={muscleList}
            ListHeaderComponent={
                <Item
                    text={"All exercises"}
                    onPress={(): void => {
                        props.newProps({
                            loadExercises: loadExerciseList,
                            saveNewExercise: saveNewExercise
                        });
                        props.newPage('ExerciseList');
                    }}
                />
            }
            renderItem={({index, item, style}) => {
                return (
                    <Item
                        getText={async (): Promise<string> => await loadMuscleName(item)}
                        onPress={(): void => {
                            props.newProps({
                                muscle: item,
                                loadExercises: async (): Promise<number[]> => await loadMuscleExerciseList(item),
                                saveNewExercise: async (): Promise<number> => {
                                    return await saveNewExercise().then(async (exercise: number): Promise<number> => {
                                        await addMuscleExercise(item, exercise)
                                        return exercise;
                                    })
                                },
                            });
                            props.newPage('ExerciseList');
                        }}
                        style={style}
                    />
                )
            }}
            ListFooterComponent={(style: globalStyle) => {
                style.color = style.accent;
                return (
                    <Item
                        text={"New muscle"}
                        onPress={
                            async (): Promise<void> => {
                                let newMuscle = await saveNewMuscle();
                                props.disableBack!(true);
                                props.newProps({
                                    muscle: newMuscle,
                                });
                                props.newPage('MuscleSettings');
                            }
                        }
                        style={style}
                    />
                );
            }}
            separator={true}
        />
    );
}

export default MuscleList;