import { hashSet } from '../utils/_types';
import { del, removeFromHashSet } from './_helpers';
import { loadDayMuscles, saveDayMuscles, loadDayExercises, saveDayExercises, loadDays, saveDays, dayName, dayExercises, dayMuscles } from './days';
import { loadMuscleDays, saveMuscleDays, loadMuscleExercises, saveMuscleExercises, loadMuscles, saveMuscles, muscleName, muscleExercises, muscleDays } from './muscles';
import { loadExerciseDays, saveExerciseDays, loadExerciseMuscles, saveExerciseMuscles, loadExercises, saveExercises, exerciseName, exerciseHistory, exerciseDays, exerciseMuscles, exerciseDelta, exerciseMinRepRec, exerciseMaxRepRec, exerciseType } from './exercises';

const deleteExercise = async (key: number): Promise<void> => {
    await del(exerciseName(key));
    await del(exerciseHistory(key));
    await del(exerciseDelta(key));
    await del(exerciseMinRepRec(key));
    await del(exerciseMaxRepRec(key));
    await del(exerciseType(key));
    
    let day: string;
    for (day in await loadExerciseDays(key))
        await removeFromHashSet(
            key,
            async (): Promise<hashSet> => await loadDayExercises(Number(day)),
            async (val: hashSet) => await saveDayExercises(Number(day), val)
        );
    await del(exerciseDays(key));
    
    let muscle: string;
    for (muscle in await loadExerciseMuscles(key))
        await removeFromHashSet(
            key,
            async (): Promise<hashSet> => await loadMuscleExercises(Number(muscle)),
            async (val: hashSet) => await saveMuscleExercises(Number(muscle), val)
        );
    await del(exerciseMuscles(key));

    await removeFromHashSet(key, loadExercises, saveExercises);
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
    await del(dayExercises(key));
    
    let muscle: string;
    for (muscle in await loadDayMuscles(key))
        await removeFromHashSet(
            key,
            async (): Promise<hashSet> => await loadMuscleDays(Number(muscle)),
            async (days: hashSet): Promise<void> => await saveMuscleDays(Number(muscle), days)
        );
    await del(dayMuscles(key));

    await removeFromHashSet(key, loadDays, saveDays);
}

const deleteMuscle = async (key: number): Promise<void> => {
    await del(muscleName(key));
    
    let exercise: string;
    for (exercise in await loadMuscleExercises(key))
        await removeFromHashSet(
            key,
            async (): Promise<hashSet> => await loadExerciseMuscles(Number(exercise)),
            async (muscles: hashSet): Promise<void> => await saveExerciseMuscles(Number(exercise), muscles)
        );
    await del(muscleExercises(key));
    
    let day: string;
    for (day in await loadMuscleDays(key))
        await removeFromHashSet(
            key,
            async (): Promise<hashSet> => await loadDayMuscles(Number(day)),
            async (muscles: hashSet): Promise<void> => await saveDayMuscles(Number(day), muscles)
        );
    await del(muscleDays(key));

    await removeFromHashSet(key, loadMuscles, saveMuscles);
}

export { deleteDay, deleteExercise, deleteMuscle };