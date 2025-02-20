import { useEffect, useState } from 'react';

import { loadDayName } from '../storage/days';
import { loadExerciseName } from '../storage/exercises';
import { getStyle } from '../utils/styles';
import ListItem from '../components/listItem';
import Button from '../components/button';
import List from '../components/list';
import { screenProps } from './_types';

const ExerciseList: React.FC<screenProps> = (props: screenProps) => {
    const [exerciseList, setExerciseList] = useState<number[]>([]);
    useEffect(() => {
        props.disableBack!(false);
        (async () => {
            if (props.getProps().day) {
                props.setHeaderRight(
                    <Button
                        title={'Settings'}
                        onPress={() => {
                            props.newProps({
                                day: props.getProps().day!,
                            });
                            props.newPage('DaySettings');
                        }}
                    />
                )
                props.setTitle(await loadDayName(props.getProps().day!));
            } else {
                props.setHeaderRight(undefined);
                props.setTitle('All exercises');
            }
        })();
        props.getProps().loadExercises!().then((result) => setExerciseList(result));
    }, []);
    return (
        <List
            style={[getStyle(), {flex: 1},]}
            data={exerciseList}
            renderItem={({item}) => {
                return (
                    <ListItem
                        getText={() => loadExerciseName(item)}
                        onPress={() => {
                            props.newProps({
                                exercise: item
                            });
                            props.newPage('Exercise');
                        }}
                    />
                )
            }}
            ListFooterComponent={
                <ListItem text={"New exercise"}
                    onPress={async (): Promise<void> => {
                        let newExercise = await props.getProps().saveNewExercise!();
                        props.disableBack!(true);
                        props.newProps({
                            exercise: newExercise,
                        });
                        props.newPage('ExerciseSettings');
                    }}
                    style={{color: getStyle().accent}}
                />
            }
        />
    );
}

export default ExerciseList;