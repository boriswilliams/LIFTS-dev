import AsyncStorage from '@react-native-async-storage/async-storage';

import { hashSet } from '../utils/_types';
import { hashSetAdd, hashSetRemove } from '../utils/utils';

// AsyncStorage.clear();

async function load(key: string, val: any): Promise<any> {
    try {
        let data = await AsyncStorage.getItem(key);
        if (typeof data === 'string') {
            let result = JSON.parse(data);
            return result;
        }
    } catch (error) {
        console.error(error);
    }
    return val;
}

async function save(key: string, val: any): Promise<void> {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(val));
    } catch (error) {
        console.error(error);
    }
}

async function del(key: string): Promise<void> {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error(error);
    }
}

async function addToHashSet(val: any, loadObject: () => Promise<hashSet>, saveObject: (x: hashSet) => Promise<void>): Promise<void> {
    let set = await loadObject();
    hashSetAdd(val, set);
    await saveObject(set);
}

async function removeFromHashSet(val: any, loadObject: () => Promise<hashSet>, saveObject: (x: hashSet) => Promise<void>): Promise<void> {
    let set = await loadObject();
    hashSetRemove(val, set);
    await saveObject(set);
}

async function addToList(val: any, loadList: () => Promise<any[]>, saveList: (x: any[]) => Promise<void>): Promise<void> {
    let list = await loadList();
    list.push(val);
    await saveList(list);
}

async function exportData(): Promise<string> {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const result = await AsyncStorage.multiGet(keys);
        
        let data: Record<string,any> = {};
        result.forEach(req => {
            if (req[1] !== null && req[1] !== undefined) {
                data[req[0]] = JSON.parse(req[1])
            } else {
                console.error(req);
            }
        });
        return JSON.stringify(data, null, 2);
    } catch (error) {
        console.error(error);
    }
    return '';
}

async function importData(s: string): Promise<boolean> {
    try {
        let data = JSON.parse(s);
        (await AsyncStorage.getAllKeys()).forEach(async function (key) {
            (key in data) || await del(key);
        });
        for (const [key, val] of Object.entries(data)) {
            await save(key, val);
        }
    } catch (error) {
        console.error(error);
        return false;
    }
    return true;
}

export { load, save, del, addToHashSet, removeFromHashSet, addToList, exportData, importData };