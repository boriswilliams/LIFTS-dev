import { Text, View } from 'react-native';

import { getStyle, DEFAULT_PADDING, BORDER_WIDTH } from '../utils/styles';
import Button from './button';

type navigationBarProps = {
    title: string;
    page: string[];
    headerLeft: React.JSX.Element | undefined;
    headerRight: React.JSX.Element | undefined;
    goBack: (x?: number) => void;
    backDisabled: boolean;
}

const NavigationBar: React.FC<navigationBarProps> = (props: navigationBarProps) => {
    const style = getStyle();
    const extraStyle: any = {
        borderColor: style.accent,
    };
    if (props.page[props.page.length-1] === 'Exercise')
        extraStyle.borderBottomWidth = 0;
    else
        extraStyle.borderBottomWidth = BORDER_WIDTH;
    return (
        <View style={[style, {flexDirection: 'row', alignItems: 'center', backgroundColor: style.backgroundDark}, extraStyle]}>
            {props.headerLeft || props.page.length > 1 && !props.backDisabled && <Button title='Back' onPress={() => props.goBack(1)}/>}
            <Text style={[style, {flex: 1, padding: DEFAULT_PADDING, backgroundColor: style.backgroundDark}]}>{props.title}</Text>
            {props.headerRight}
        </View>
    );
}

export default NavigationBar;