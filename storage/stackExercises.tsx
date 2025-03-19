import { hashSet } from '../utils/_types';
import { removeFromHashSet, addToHashSet, del } from './_helpers';
import { loadStackExercises, loadStacks, saveStackExercises, saveStacks, stackData, stackExercises, stackName } from './stacks';
import { exerciseStack, loadExerciseStack, saveExerciseStack } from './exercises';

const addStackExercise = async (stack: number, exercise: number): Promise<void> => {
    await saveExerciseStack(exercise, stack);
    await addToHashSet(
        exercise,
        async () => await loadStackExercises(stack),
        async (exercise: hashSet): Promise<void> => await saveStackExercises(stack, exercise)
    );
}

const deleteStackExercise = async (stack: number, exercise: number): Promise<void> => {
    del(exerciseStack(exercise));
    await removeFromHashSet(
        exercise,
        async (): Promise<hashSet> => await loadStackExercises(stack),
        async (exercise: hashSet): Promise<void> => await saveStackExercises(stack, exercise)
    );
}

const deleteStack = async (key: number): Promise<void> => {
    await del(stackName(key));
    await del(stackData(key));
    
    let exercise: string;
    for (exercise in await loadStackExercises(key))
        del(exerciseStack(Number(exercise)));
    await del(stackExercises(key));

    await removeFromHashSet(key, loadStacks, saveStacks);
}

export { addStackExercise, deleteStackExercise, deleteStack };