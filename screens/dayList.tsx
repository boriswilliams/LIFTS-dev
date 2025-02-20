import { useEffect, useState } from 'react';

import { loadDayList, saveNewDay, loadDayName, loadDayExerciseList } from '../storage/days';
import { loadExerciseList, saveNewExercise } from '../storage/exercises';
import { addDayExercise } from '../storage/both';
import { getStyle, APP_NAME } from '../utils/styles';
import ListItem from '../components/listItem';
import Button from '../components/button';
import List from '../components/list';
import { screenProps } from './_types';

const DayList: React.FC<screenProps> = (props: screenProps) => {
    const [dayList, setDayList] = useState<number[]>([]);
    useEffect((): void => {
        props.disableBack!(false);
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
        props.setTitle(APP_NAME);
    }, []);
    return (
        <List
            style={[getStyle(), {flex: 1},]}
            data={dayList}
            ListHeaderComponent={
                <ListItem
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
            renderItem={({item}) => {
                return (
                    <ListItem
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
                    />
                )
            }}
            ListFooterComponent={
                <ListItem
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
                    style={{color: getStyle().accent}}
                />
            }
        />
    );
}

export default DayList;