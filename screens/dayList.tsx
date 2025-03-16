import { useEffect, useState } from 'react';

import { loadDayList, saveNewDay, loadDayName, loadDayExerciseList } from '../storage/days';
import { loadExerciseList, saveNewExercise } from '../storage/exercises';
import { addDayExercise } from '../storage/dayExercises';
import { getStyle, APP_NAME, globalStyle } from '../utils/styles';
import Item from '../components/item';
import Button from '../components/button';
import List from '../components/list';
import { screenProps } from './_types';

const DayList: React.FC<screenProps> = (props: screenProps) => {
    const [dayList, setDayList] = useState<number[]>([]);
    useEffect((): void => {
        props.disableBack!(false);
        props.makeSwitchButton('Muscles', 'MuscleList');
        props.setHeaderRight(
            <Button
                title={'Profile'}
                onPress={() => {
                    props.newProps({});
                    props.newPage('Profile');
                }}
            />
        )
        loadDayList().then((result: number[]): void => { setDayList(result) });
        props.setTitle('Workouts');
    }, []);
    return (
        <List
            style={[getStyle(), {flex: 1},]}
            data={dayList}
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
                        getText={async (): Promise<string> => await loadDayName(item)}
                        onPress={(): void => {
                            props.newProps({
                                day: item,
                                loadExercises: async (): Promise<number[]> => await loadDayExerciseList(item),
                                saveNewExercise: async (): Promise<number> => {
                                    return await saveNewExercise().then(async (exercise: number): Promise<number> => {
                                        await addDayExercise(item, exercise)
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
                        text={"New workout"}
                        onPress={
                            async (): Promise<void> => {
                                let newDay = await saveNewDay();
                                props.disableBack!(true);
                                props.newProps({
                                    day: newDay,
                                });
                                props.newPage('DaySettings');
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

export default DayList;