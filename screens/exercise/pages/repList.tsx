import { Pressable } from 'react-native';
import { useEffect, useState } from 'react';

import Row from '../../../components/row';
import List from '../../../components/list';
import { pageProps } from '../_types';
import { loadExerciseDelta, loadExerciseHistory } from '../../../storage/exercises';
import { calcWeight, displayWeight, MAX_REPS, round, roundWeightDown } from '../_helpers';

const RepList: React.FC<pageProps> = (props: pageProps) => {
    const [data, setData] = useState<string[][]>([]);
    useEffect(() => {
        (async (): Promise<void> => {
            let delta = await loadExerciseDelta(props.exercise)
            let history = await loadExerciseHistory(props.exercise)
            let maxes: Record<number, number> = {};
            for (let {reps, weight} of history)
                if (reps >= 1)
                    maxes[reps] = Math.max(maxes[reps] || 0, weight);
            let oneRM = Math.max(0, ...Object.entries(maxes).map(([r, w]): number => calcWeight(w, Number(r), 1)));
            let data: string[][] = []
            let weight = 0;
            let est: number, rec: number;
            for (let reps = MAX_REPS; reps > 0; reps--) {
                weight = Math.max(weight, maxes[reps] || 0);
                est = calcWeight(oneRM, 1, reps);
                rec = await roundWeightDown(props.exercise, est);
                if (rec == weight) rec += delta;
                data.unshift([String(reps), String(round(weight)), await displayWeight(props.exercise, est), await displayWeight(props.exercise, rec)]);
            }
            setData(data);
        })();
    }, [])
    return (
        <List
            data={data}
            ListHeaderComponent={
                <Row data={['Reps', 'Weight', 'Est. weight', 'Do weight']}/>
            }
            renderItem={({index, item}) => {
                return (
                    <Pressable
                        key={index}
                    >
                        <Row data={item}/>
                    </Pressable>
                )
            }}
        />
    );
}

export default RepList;