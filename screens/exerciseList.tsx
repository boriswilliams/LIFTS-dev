import { useEffect, useState } from 'react';

import { loadDayName } from '../storage/days';
import { loadMuscleName } from '../storage/muscles';
import { loadExerciseName } from '../storage/exercises';
import { getStyle, globalStyle } from '../utils/styles';
import Item from '../components/item';
import Button from '../components/button';
import List from '../components/list';
import { screenProps } from './_types';

const ExerciseList: React.FC<screenProps> = (props: screenProps) => {
    const [exerciseList, setExerciseList] = useState<number[]>([]);
    useEffect(() => {
        props.disableBack!(false);
        props.makeSwitchButton();
        (async () => {
            if (props.getProps().day !== undefined) {
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
            } else if (props.getProps().muscle !== undefined) {
                props.setHeaderRight(
                    <Button
                        title={'Settings'}
                        onPress={() => {
                            props.newProps({
                                muscle: props.getProps().muscle!,
                            });
                            props.newPage('MuscleSettings');
                        }}
                    />
                )
                props.setTitle(await loadMuscleName(props.getProps().muscle!));
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
            renderItem={({index, item, style}) => {
                return (
                    <Item
                        getText={() => loadExerciseName(item)}
                        onPress={() => {
                            props.newProps({
                                exercise: item
                            });
                            props.newPage('Exercise');
                        }}
                        style={style}
                    />
                )
            }}
            ListFooterComponent={(style: globalStyle) => {
                style.color = style.accent;
                return (
                    <Item text={"New exercise"}
                        onPress={async (): Promise<void> => {
                            let newExercise = await props.getProps().saveNewExercise!();
                            props.disableBack!(true);
                            props.newProps({
                                exercise: newExercise,
                            });
                            props.newPage('ExerciseSettings');
                        }}
                        style={style}
                    />
                );
            }}
            separator={true}
        />
    );
}

export default ExerciseList;