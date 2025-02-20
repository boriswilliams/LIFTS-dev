import { View, TextStyle } from 'react-native';

import { globalStyle } from '../utils/styles';
import { getStyle } from '../utils/styles';
import Cell from './cell';

type rowProps = {
    data: string[];
    selected?: boolean;
}

const Row: React.FC<rowProps> = (props: rowProps) => {
    let customStyle: TextStyle = {textAlign: 'center'};
    let style: globalStyle = getStyle();
    if (props.selected)
        style.color=style.accent;
    return (
        <View style={[style, {flex: 1}, {flexDirection: 'row'}]}>
            {props.data.map((item, index) => <Cell key={index} style={[style, {flex: 1}, customStyle]} text={item}/>)}
        </View>
    );
}

export default Row;