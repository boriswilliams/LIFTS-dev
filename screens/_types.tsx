import { navigatorProps } from '../app/_types';

type screenProps = {
    newPage: (s: string) => void;
    newProps: (p: navigatorProps) => void;
    getProps: () => navigatorProps;
    setTitle: (s: string) => void;
    setHeaderRight: (x: React.JSX.Element|undefined) => void;
    goBack: (x?: number) => void;
    disableBack?: (x: boolean) => void;
    backDisabled?: boolean;
};

export { screenProps };