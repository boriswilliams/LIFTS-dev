import { hashSet } from '../utils/_types';
import { removeFromHashSet, addToHashSet } from './_helpers';
import { loadDayExercises, saveDayExercises } from './days';
import { loadExerciseDays, saveExerciseDays } from './exercises';

const addDayExercise = async (day: number, exercise: number): Promise<void> => {
    await addToHashSet(
        day,
        async () => await loadExerciseDays(exercise),
        async (days: hashSet): Promise<void> => await saveExerciseDays(exercise, days)
    );
    await addToHashSet(
        exercise,
        async () => await loadDayExercises(day),
        async (exercises: hashSet): Promise<void> => await saveDayExercises(day, exercises)
    );
}

const deleteDayExercise = async (day: number, exercise: number): Promise<void> => {
    await removeFromHashSet(
        day,
        async (): Promise<hashSet> => await loadExerciseDays(exercise),
        async (days: hashSet): Promise<void> => await saveExerciseDays(exercise, days)
    );
    await removeFromHashSet(
        exercise,
        async (): Promise<hashSet> => await loadDayExercises(day),
        async (exercises: hashSet): Promise<void> => await saveDayExercises(day, exercises)
    );
}

export { addDayExercise, deleteDayExercise };