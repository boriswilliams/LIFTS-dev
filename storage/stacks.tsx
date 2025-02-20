import { load, save, addToHashSet, del, removeFromHashSet } from './_helpers';
import { hashSet } from '../utils/_types';

const stacks = (): string => 'stacks';
const loadStacks = async (): Promise<hashSet> => await load(stacks(), {});
const saveStacks = async (val: hashSet): Promise<void> => await save(stacks(), val);

const loadNextStackIndex = async (): Promise<number> => {
    let key = 'nextStackIndex';
    let val = await load(key, 1);
    await save(key, val+1);
    return val
}

const loadStackList = async (): Promise<number[]> => {
    let stacks = await loadStacks();
    let res = [];
    let day: string;
    for (day in stacks)
        res.push(Number(day));
    return res
}

const stackName = (key: number): string => `stack_${key}_name`;
const loadStackName = async (key: number): Promise<string> => await load(stackName(key), 'New stack');
const saveStackName = async (key: number, val: string): Promise<void> => await save(stackName(key), val);

const saveNewStack = async (): Promise<number> => {
    let index = await loadNextStackIndex();
    await addToHashSet(index, loadStacks, saveStacks);
    return index;
}

const stackData = (key: number): string => `stack_${key}_data`;
const loadStackData = async (key: number): Promise<number[]> => await load(stackData(key), []);
const saveStackData = async (key: number, val: number[]): Promise<void> => await save(stackData(key), val);

const deleteStack = async (key: number): Promise<void> => {
    await del(stackName(key));
    await del (stackData(key));
    await removeFromHashSet(key, loadStacks, saveStacks)
}

export { loadStacks, loadStackList, saveNewStack, loadStackName, saveStackName, loadStackData, saveStackData, saveStacks, stackName, stackData, deleteStack };