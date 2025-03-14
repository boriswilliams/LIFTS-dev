import { hashSet } from '../utils/_types';
import { removeFromHashSet, addToHashSet } from './_helpers';
import { loadDayMuscles, saveDayMuscles } from './days';
import { loadMuscleDays, saveMuscleDays } from './muscles';

const addDayMuscle = async (day: number, exercise: number): Promise<void> => {
    await addToHashSet(
        day,
        async () => await loadMuscleDays(exercise),
        async (days: hashSet): Promise<void> => await saveMuscleDays(exercise, days)
    );
    await addToHashSet(
        exercise,
        async () => await loadDayMuscles(day),
        async (muscle: hashSet): Promise<void> => await saveDayMuscles(day, muscle)
    );
}

const deleteDayMuscle = async (day: number, exercise: number): Promise<void> => {
    await removeFromHashSet(
        day,
        async (): Promise<hashSet> => await loadMuscleDays(exercise),
        async (days: hashSet): Promise<void> => await saveMuscleDays(exercise, days)
    );
    await removeFromHashSet(
        exercise,
        async (): Promise<hashSet> => await loadDayMuscles(day),
        async (muscle: hashSet): Promise<void> => await saveDayMuscles(day, muscle)
    );
}

export { addDayMuscle, deleteDayMuscle };