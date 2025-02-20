import { hashSet } from './_types';

function hashSetAdd(val: any, set: hashSet): void {
    set[val] = 0;
}

function hashSetRemove(val: any, set: hashSet): void {
    delete set[val];
}

function hashSetToggle(val: any, set: hashSet): number {
    let res: number = 0;
    if (val in set) {
        hashSetRemove(val, set);
        res -= 1;
    } else {
        hashSetAdd(val, set);
        res += 1;
    }
    return res;
}

function titleCase(str: string): string {
    return str.replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}

function isNumber(s: string): boolean {
    return s.match(/^\d*\.?\d*$/) != null;
}

const ACCURACY = 1000;

const round = (value: number, accuracy: number = ACCURACY): number => Math.round(accuracy*value)/accuracy;

export { hashSetAdd, hashSetRemove, hashSetToggle, titleCase, isNumber, round };