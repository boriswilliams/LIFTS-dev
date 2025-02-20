import { Pressable } from 'react-native';
import { useEffect, useState } from 'react';

import Row from '../../../components/row';
import List from '../../../components/list';
import { calcReps, calcWeight, displayWeight, lowerWeight, MAX_REPS, roundWeightDown } from '../_helpers';
import { pageProps } from '../_types';
import { loadExerciseDelta, loadExerciseHistory } from '../../../storage/exercises';

type weightListRow = {
    weight: number|string,
    reps: number,
    rec: number;
}

let each_limit = 9;
let total_limit = 15;
let lower_rep_rec = 1;
let upper_rep_rec = 15;

async function add(temp: number[][], list: weightListRow[][], w: number, r: number): Promise<void> {
    let rec = Math.floor(r);
    let w_done;
    for (let i = 0; i < 2; i++) {
        rec = Math.min(rec, MAX_REPS);
        if (rec > 0) {
            w_done = temp[rec-1][1];
            // filter for PRs
            if (w > w_done && lower_rep_rec <= rec && rec <= upper_rep_rec) {
                list[i].push({weight: w, reps: r, rec: rec});
                break;
            }
        }
        rec += 1;
    }
}

function comp(cx: number, cy: number): number {
    if (cx < cy)
        return -1;
    if (cx > cy)
        return 1;
    return 0;
}

const WeightList: React.FC<pageProps> = (props: pageProps) => {
    const [data, setData] = useState<weightListRow[]>([]);
    useEffect(() => {
        (async () => {
            let delta = await loadExerciseDelta(props.exercise)
            let history = await loadExerciseHistory(props.exercise)
            let maxes: Record<number, number> = {};
            for (let {reps, weight} of history)
                maxes[reps] = Math.max(maxes[reps] || 0, weight);
            let oneRM = Math.max(...Object.entries(maxes).map(([r, w]) => calcWeight(w, Number(r), 1)));
            let temp = []
            let weight = 0;
            for (let reps = MAX_REPS; reps > 0; reps--) {
                weight = Math.max(weight, maxes[reps] || 0);
                temp.unshift([reps, weight]);
            }
            let w = await roundWeightDown(props.exercise, oneRM);
            let data: weightListRow[][] = [[], []];
            let r: number;
            while (Math.floor(r = calcReps(oneRM, w, MAX_REPS)) <= MAX_REPS && w >= delta) {
                await add(temp, data, w, r);
                w = await lowerWeight(props.exercise, w);
            }
            await add(temp, data, w, r);
            data[0].sort((x: weightListRow, y: weightListRow): number => {
                // EASIEST
                let cx: number = Number(x.weight) - calcWeight(oneRM, 1, x.rec);
                let cy: number = Number(y.weight) - calcWeight(oneRM, 1, y.rec);
                let res: number;
                if ((res = comp(cx, cy)) != 0)
                    return res
                // FURTHEST PR
                cx = temp[x.rec-1][1] - Number(x.weight);
                cy = temp[y.rec-1][1] - Number(y.weight);
                return comp(cx, cy);
            });
            data[1].sort((x: weightListRow, y: weightListRow): number => {
                // EASIEST WEIGHT
                let cx = Number(x.weight) - calcWeight(oneRM, 1, x.rec);
                let cy = Number(y.weight) - calcWeight(oneRM, 1, y.rec);
                return comp(cx, cy);
            });
            let stringData: weightListRow[] = data[0].slice(0, each_limit).concat(data[1].slice(0, each_limit)).slice(0, total_limit);
            for (let i = 0; i < stringData.length; i++) {
                stringData[i].weight = await displayWeight(props.exercise, Number(stringData[i].weight));
            }
            setData(stringData);
        })();
    }, []);
    return (
        <List
            data={data}
            ListHeaderComponent={
                <Row data={['Weight', 'Est. reps', 'Do reps']}/>
            }
            renderItem={({index, item}: {index: number, item: weightListRow}) => {
                let rowData: string[] = [String(item.weight), String(item.reps), String(item.rec)];
                if (item.reps < 1) rowData[1] = '<1';
                else if (item.reps <= MAX_REPS) rowData[1] = item.reps.toFixed(1);
                else rowData[1] = `>${MAX_REPS}`;
                return (
                    <Pressable
                        key={index}
                    >
                        <Row data={rowData}/>
                    </Pressable>
                )
            }}
        />
    );
}

export default WeightList;