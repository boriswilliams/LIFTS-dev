type navigatorProps = {
    day?: number;
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
}

type contextDetails = {
    theme: string;
}

type contextAccess = {
    state: contextDetails;
    setState: (x: contextDetails) => void;
}

export { navigatorProps, contextDetails, contextAccess };