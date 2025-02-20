import { loadBodyWeight } from '../../storage/profile';
import { loadExerciseDelta, loadExerciseType } from '../../storage/exercises';
import { round } from '../../utils/utils';

let MAX_REPS = 20;

let TABLE = [100, 97, 94.5, 91.5, 88.5, 86, 83, 80.5, 77.5, 74.5, 73, 71, 69.5, 68, 66.5, 65, 64, 62.5, 61, 60]

function countDecimals(x: number) {
    if(Math.floor(x) === x) return 0;
    return String(x).split(".")[1].length || 0; 
}

function calcWeight(w: number, x: number, y: number): number {
    if (x < 1 || y < 1) return 0;
    return w * TABLE[y-1] / TABLE[x-1];
}

function calcReps(m: number, w: number, n: number): number {
    let p = 100 * w / m;
    let res = n+1;
    if (p > 100) {
        res = 0;
    } else {
        if (TABLE.includes(p)) return TABLE.indexOf(p) + 1;
        for (let i = 1; i < n; i++) {
            if (TABLE[i-1] > p && p > TABLE[i]) {
                res = i + 1 - (p - TABLE[i]) / (TABLE[i-1] - TABLE[i])
                break;
            }
        }
    }
    return res;
}

const roundDownDelta = (weight: number, delta: number): number => Math.floor(weight/delta)*delta;

const roundWeightDown = async (exercise: number, weight: number): Promise<number> => {
    let delta = await loadExerciseDelta(exercise);
    if (await loadExerciseType(exercise) == 'body') {
        let bodyWeight = await loadBodyWeight();
        let diff = weight - bodyWeight;
        return bodyWeight + roundDownDelta(diff, delta);
    }
    return roundDownDelta(weight, delta);
}

const lowerWeight = async (exercise: number, weight: number): Promise<number> => {
    let delta = await loadExerciseDelta(exercise)
    return weight - delta;
}

const displayWeight = async (exercise: number, weight: number): Promise<string> => {
    let delta = await loadExerciseDelta(exercise);
    if (await loadExerciseType(exercise) == 'body') {
        let bodyWeight = await loadBodyWeight();
        let diff = weight - bodyWeight;
        if (diff == 0)
            return String(weight);
        let sign: string;
        if (diff < 0)
            sign = '-';
        else
            sign = '+';
        return `${bodyWeight}${sign}${round(Math.abs(diff), 10**Math.max(countDecimals(delta), 1))}`;
    }
    return String(round(weight, 10**Math.max(countDecimals(delta), 1)));
}

export { calcWeight, calcReps, roundWeightDown, MAX_REPS, lowerWeight, displayWeight, round, countDecimals };