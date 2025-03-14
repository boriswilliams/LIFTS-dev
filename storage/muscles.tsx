import { load, save, addToHashSet, loadList } from './_helpers';
import { hashSet } from '../utils/_types';

const muscles = (): string => 'muscles';
const loadMuscles = async (): Promise<hashSet> => await load(muscles(), {});
const saveMuscles = async (val: hashSet): Promise<void> => await save(muscles(), val);

const loadNextMuscleIndex = async (): Promise<number> => {
    let key = 'nextMuscleIndex';
    let val = await load(key, 0);
    await save(key, val+1);
    return val
}

const loadMuscleList = async (): Promise<number[]> => {
    return loadList(loadMuscles);
}

const muscleName = (key: number): string => `muscle_${key}_name`;
const loadMuscleName = async (key: number): Promise<string> => await load(muscleName(key), 'New muscle');
const saveMuscleName = async (key: number, val: string): Promise<void> => await save(muscleName(key), val);

const saveNewMuscle = async (): Promise<number> => {
    let index = await loadNextMuscleIndex();
    await addToHashSet(index, loadMuscles, saveMuscles);
    return index;
}

const muscleExercises = (key: number): string => `muscle_${key}_exercises`;
const loadMuscleExercises = async (key: number): Promise<hashSet> => await load(muscleExercises(key), {});
const saveMuscleExercises = async (key: number, val: hashSet): Promise<void> => await save(muscleExercises(key), val);

const loadMuscleExerciseList = async (key: number): Promise<number[]> => {
    return loadList(async () => await loadMuscleExercises(key));
}

const muscleDays = (key: number): string => `muscle_${key}_days`;
const loadMuscleDays = async (key: number): Promise<hashSet> => await load(muscleDays(key), {});
const saveMuscleDays = async (key: number, val: hashSet): Promise<void> => await save(muscleDays(key), val);

const loadMuscleDayList = async (key: number): Promise<number[]> => {
    return loadList(async () => await loadMuscleDays(key));
}

export { loadMuscles, loadMuscleList, saveNewMuscle, loadMuscleName, saveMuscleName, loadMuscleExercises, saveMuscleExercises, saveMuscles, muscleName, muscleExercises, loadMuscleExerciseList, muscleDays, loadMuscleDays, saveMuscleDays, loadMuscleDayList };