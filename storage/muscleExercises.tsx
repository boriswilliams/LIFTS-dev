import { hashSet } from '../utils/_types';
import { removeFromHashSet, addToHashSet } from './_helpers';
import { loadMuscleExercises, saveMuscleExercises } from './muscles';
import { loadExerciseMuscles, saveExerciseMuscles } from './exercises';

const addMuscleExercise = async (muscle: number, exercise: number): Promise<void> => {
    await addToHashSet(
        muscle,
        async () => await loadExerciseMuscles(exercise),
        async (muscles: hashSet): Promise<void> => await saveExerciseMuscles(exercise, muscles)
    );
    await addToHashSet(
        exercise,
        async () => await loadMuscleExercises(muscle),
        async (exercises: hashSet): Promise<void> => await saveMuscleExercises(muscle, exercises)
    );
}

const deleteMuscleExercise = async (muscle: number, exercise: number): Promise<void> => {
    await removeFromHashSet(
        muscle,
        async (): Promise<hashSet> => await loadExerciseMuscles(exercise),
        async (muscles: hashSet): Promise<void> => await saveExerciseMuscles(exercise, muscles)
    );
    await removeFromHashSet(
        exercise,
        async (): Promise<hashSet> => await loadMuscleExercises(muscle),
        async (exercises: hashSet): Promise<void> => await saveMuscleExercises(muscle, exercises)
    );
}

const addExerciseMuscle = async (exercise: number, muscle: number): Promise<void> => {
    await addToHashSet(
        exercise,
        async () => await loadMuscleExercises(muscle),
        async (exercises: hashSet): Promise<void> => await saveMuscleExercises(muscle, exercises)
    );
    await addToHashSet(
        muscle,
        async () => await loadExerciseMuscles(exercise),
        async (muscles: hashSet): Promise<void> => await saveExerciseMuscles(exercise, muscles)
    );
}

const deleteExerciseMuscle = async (exercise: number, muscle: number): Promise<void> => {
    await removeFromHashSet(
        exercise,
        async (): Promise<hashSet> => await loadMuscleExercises(muscle),
        async (exercises: hashSet): Promise<void> => await saveMuscleExercises(muscle, exercises)
    );
    await removeFromHashSet(
        muscle,
        async (): Promise<hashSet> => await loadExerciseMuscles(exercise),
        async (muscles: hashSet): Promise<void> => await saveExerciseMuscles(exercise, muscles)
    );
}

export { addMuscleExercise, deleteMuscleExercise, addExerciseMuscle, deleteExerciseMuscle };