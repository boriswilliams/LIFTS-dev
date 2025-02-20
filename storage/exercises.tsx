import { load, save, del, addToHashSet, addToList } from './_helpers';
import { hashSet, set } from '../utils/_types';

const exercises = (): string => 'exercises';
const loadExercises = async (): Promise<hashSet> => await load(exercises(), {});
const saveExercises = async (val: hashSet): Promise<void> => await save(exercises(), val);

const loadNextExerciseIndex = async (): Promise<number> => {
    let key = 'nextExerciseIndex';
    let val = await load(key, 0);
    await save(key, val+1);
    return val
}

const loadExerciseList = async (): Promise<number[]> => {
    let exercises = await loadExercises();
    let res = [];
    let exercise: string;
    for (exercise in exercises)
        res.push(Number(exercise));
    return res
}

const saveNewExercise = async (): Promise<number> => {
    const index = await loadNextExerciseIndex()
    await addToHashSet(index, loadExercises, saveExercises);
    return index;
}

const exerciseName = (key: number): string => `exercise_${key}_name`;
const loadExerciseName = async (key: number): Promise<string> => await load(exerciseName(key), 'New exercise');
const saveExerciseName = async (key: number, val: string): Promise<void> => await save(exerciseName(key), val);

const exerciseHistory = (key: number): string => `exercise_${key}_history`;
const loadExerciseHistory = async (key: number): Promise<set[]> => await load(exerciseHistory(key), []);
const saveExerciseHistory = async (key: number, val: set[]): Promise<void> => await save(exerciseHistory(key), val);
const appendExerciseHistory = async (key: number, time: number, weight: number, reps: number): Promise<void> =>
    await addToList({time: time, weight: weight, reps: reps}, async (): Promise<set[]> => await loadExerciseHistory(key), async (val: set[]) => await saveExerciseHistory(key, val))

const exerciseDays = (key: number): string => `exercise_${key}_days`;
const loadExerciseDays = async (key: number): Promise<hashSet> => await load(exerciseDays(key), {});
const saveExerciseDays = async (key: number, val: hashSet): Promise<void> => await save(exerciseDays(key), val);

const loadExerciseDayList = async (key: number): Promise<number[]> => {
    let days = await loadExerciseDays(key);
    let res = [];
    let day: string;
    for (day in days)
        res.push(Number(day));
    return res;
}

const exerciseMinRepRec = (key: number): string => `exercise_${key}_minRepRec`;
const loadExerciseMinRepRec = async (key: number): Promise<number> => await load(exerciseMinRepRec(key), 5);
const saveExerciseMinRepRec = async (key: number, val: number): Promise<void> => await save(exerciseMinRepRec(key), val);

const exerciseMaxRepRec = (key: number): string => `exercise_${key}_maxRepRec`;
const loadExerciseMaxRepRec = async (key: number): Promise<number> => await load(exerciseMaxRepRec(key), 14);
const saveExerciseMaxRepRec = async (key: number, val: number): Promise<void> => await save(exerciseMaxRepRec(key), val);

const TYPES = ['delta', 'custom', 'body'];

const exerciseType = (key: number): string => `exercise_${key}_type`;
const loadExerciseType = async (key: number): Promise<string> => await load(exerciseType(key), 'delta'); // delta custom body
const saveExerciseType = async (key: number, val: string): Promise<void> => await save(exerciseType(key), val);

const exerciseDelta = (key: number): string => `exercise_${key}_delta`;
const loadExerciseDelta = async (key: number): Promise<number> => await load(exerciseDelta(key), 1);
const saveExerciseDelta = async (key: number, val: number): Promise<void> => await save(exerciseDelta(key), val);

const exerciseCustom = (key: number): string => `exercise_${key}_custom`;
const loadExerciseCustom = async (key: number): Promise<number[]> => await load(exerciseCustom(key), []);
const saveExerciseCustom = async (key: number, val: number[]): Promise<void> => await save(exerciseCustom(key), val);

const loadExerciseWeights = async (key: number): Promise<any> => {
    return 0
}

export { loadExercises, saveExercises, saveNewExercise, loadExerciseName, saveExerciseName, loadExerciseHistory, saveExerciseHistory, appendExerciseHistory, loadExerciseDays, saveExerciseDays, loadExerciseMinRepRec, saveExerciseMinRepRec, loadExerciseMaxRepRec, saveExerciseMaxRepRec, loadExerciseType, saveExerciseType, loadExerciseDelta, saveExerciseDelta, loadExerciseCustom, saveExerciseCustom, loadExerciseWeights, TYPES, exerciseName, exerciseHistory, exerciseDays, exerciseMinRepRec, exerciseMaxRepRec, exerciseType, exerciseDelta, exerciseCustom, loadExerciseList, loadExerciseDayList };