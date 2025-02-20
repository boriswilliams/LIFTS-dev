import { load, save, addToHashSet } from './_helpers';
import { hashSet } from '../utils/_types';

const days = (): string => 'days';
const loadDays = async (): Promise<hashSet> => await load(days(), {});
const saveDays = async (val: hashSet): Promise<void> => await save(days(), val);

const loadNextDayIndex = async (): Promise<number> => {
    let key = 'nextDayIndex';
    let val = await load(key, 1);
    await save(key, val+1);
    return val
}

const loadDayList = async (): Promise<number[]> => {
    let days = await loadDays();
    let res = [];
    let day: string;
    for (day in days)
        res.push(Number(day));
    return res
}

const dayName = (key: number): string => `day_${key}_name`;
const loadDayName = async (key: number): Promise<string> => await load(dayName(key), 'New day');
const saveDayName = async (key: number, val: string): Promise<void> => await save(dayName(key), val);

const saveNewDay = async (): Promise<number> => {
    let index = await loadNextDayIndex();
    await addToHashSet(index, loadDays, saveDays);
    return index;
}

const dayExercises = (key: number): string => `day_${key}_exercises`;
const loadDayExercises = async (key: number): Promise<hashSet> => await load(dayExercises(key), {});
const saveDayExercises = async (key: number, val: hashSet): Promise<void> => await save(dayExercises(key), val);

const loadDayExerciseList = async (key: number): Promise<number[]> => {
    let days = await loadDayExercises(key);
    let res = [];
    let day: string;
    for (day in days)
        res.push(Number(day));
    return res;
}

export { loadDays, loadDayList, saveNewDay, loadDayName, saveDayName, loadDayExercises, saveDayExercises, saveDays, dayName, dayExercises, loadDayExerciseList };