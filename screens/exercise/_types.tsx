import { screenProps } from '../_types';

type pageProps = {
    exercise: number;
    weight?: string;
    changeWeight?: (x: string) => void;
    reps?: string;
    changeReps?: (x: string) => void;
    extra?: number;
    screenProps?: screenProps;
}

export { pageProps }