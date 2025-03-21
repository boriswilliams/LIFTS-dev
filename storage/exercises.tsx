import { load, save, addToHashSet, addToList, loadList } from './_helpers';
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
    return loadList(loadExercises);
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
    return loadList(async () => await loadExerciseDays(key));
}

const exerciseMuscles = (key: number): string => `exercise_${key}_muscles`;
const loadExerciseMuscles = async (key: number): Promise<hashSet> => await load(exerciseMuscles(key), {});
const saveExerciseMuscles = async (key: number, val: hashSet): Promise<void> => await save(exerciseMuscles(key), val);

const loadExerciseMuscleList = async (key: number): Promise<number[]> => {
    return loadList(async () => await loadExerciseMuscles(key));
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

const exerciseBodyAssisted = (key: number): string => `exercise_${key}_body_assisted`;
const loadExerciseBodyAssisted = async (key: number): Promise<boolean> => await load(exerciseBodyAssisted(key), false);
const saveExerciseBodyAssisted = async (key: number, val: boolean): Promise<void> => await save(exerciseBodyAssisted(key), val);

const exerciseStack = (key: number): string => `exercise_${key}_stack`;
const loadExerciseStack = async (key: number): Promise<number> => await load(exerciseStack(key), -1);
const saveExerciseStack = async (key: number, val: number): Promise<void> => await save(exerciseStack(key), val);

const exerciseMaxWeight = (key: number): string => `exercise_${key}_max_weight`;
const loadExerciseMaxWeight = async (key: number): Promise<number> => await load(exerciseMaxWeight(key), 100);
const saveExerciseMaxWeight = async (key: number, val: number): Promise<void> => await save(exerciseMaxWeight(key), val);

const loadExerciseWeights = async (key: number): Promise<any> => {
    return 0
}

export { loadExercises, saveExercises, saveNewExercise, loadExerciseName, saveExerciseName, loadExerciseHistory, saveExerciseHistory, appendExerciseHistory, loadExerciseDays, saveExerciseDays, loadExerciseMuscles, saveExerciseMuscles, loadExerciseMinRepRec, saveExerciseMinRepRec, loadExerciseMaxRepRec, saveExerciseMaxRepRec, loadExerciseType, saveExerciseType, loadExerciseDelta, saveExerciseDelta, loadExerciseWeights, TYPES, exerciseName, exerciseHistory, exerciseDays, exerciseMuscles, exerciseMinRepRec, exerciseMaxRepRec, exerciseType, exerciseDelta, loadExerciseList, loadExerciseDayList, loadExerciseMuscleList, loadExerciseBodyAssisted, saveExerciseBodyAssisted, exerciseStack, loadExerciseStack, saveExerciseStack, exerciseMaxWeight, loadExerciseMaxWeight, saveExerciseMaxWeight };