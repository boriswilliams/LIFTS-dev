import { hashSet } from '../utils/_types';
import { del, removeFromHashSet, addToHashSet } from './_helpers';
import { loadDayExercises, saveDayExercises, loadDays, saveDays, dayName, dayExercises } from './days';
import { loadExerciseDays, saveExerciseDays, loadExercises, saveExercises, exerciseName, exerciseHistory, exerciseDays, exerciseDelta, exerciseMinRepRec, exerciseMaxRepRec, exerciseType } from './exercises';

const deleteExercise = async (key: number): Promise<void> => {
    await del(exerciseName(key));
    await del(exerciseHistory(key));
    
    let day: string;
    for (day in await loadExerciseDays(key))
        await removeFromHashSet(
            key,
            async (): Promise<hashSet> => await loadDayExercises(Number(day)),
            async (val: hashSet) => await saveDayExercises(Number(day), val)
        );
    await removeFromHashSet(key, loadExercises, saveExercises)
    await del(exerciseDays(key));
    
    await del(exerciseDelta(key));
    await del(exerciseMinRepRec(key));
    await del(exerciseMaxRepRec(key));
    await del(exerciseType(key));
}

const deleteDay = async (key: number): Promise<void> => {
    await del(dayName(key));
    
    let exercise: string;
    for (exercise in await loadDayExercises(key))
        await removeFromHashSet(
            key,
            async (): Promise<hashSet> => await loadExerciseDays(Number(exercise)),
            async (days: hashSet): Promise<void> => await saveExerciseDays(Number(exercise), days)
        );
    await removeFromHashSet(key, loadDays, saveDays);
    await del(dayExercises(key));
}

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

export { deleteDay, addDayExercise, deleteDayExercise, deleteExercise };