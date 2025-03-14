import { hashSet } from "../utils/_types";

type navigatorProps = {
    day?: number;
    muscle?: number;
    exercise?: number;
    loadExercises?: () => Promise<number[]>;
    saveNewExercise?: () => Promise<number>;
    execute?: () => Promise<void>;
    getName?: () => Promise<string>;
    backDistance?: number;
    action?: string;
    data?: any;
    saveNewStack?: () => Promise<number>;
    stack?: number;
    loadIncluded?: () => Promise<hashSet>;
    updateMuscles?: (included: number[], excluded: number[], includedSet: hashSet) => Promise<void>;
}

type contextDetails = {
    theme: string;
}

type contextAccess = {
    state: contextDetails;
    setState: (x: contextDetails) => void;
}

export { navigatorProps, contextDetails, contextAccess };