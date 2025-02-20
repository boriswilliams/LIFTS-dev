import { TextStyle, Text, View } from 'react-native';
import { globalStyle } from '../utils/styles';

type cellProps = {
    style: (globalStyle | TextStyle)[];
    text: string;
}

const Cell: React.FC<cellProps> = (props: cellProps) => {
    if  (props.text.match(/^[<>+-\.\d]*$/) == null) {
        return <Text style={props.style}>{props.text}</Text>
    }
    console.log(props.text);
    const chars = '<>+-.';
    let left = '';
    let middle = '';
    let right = '';
    left = props.text;
    for (let i = 0; i < chars.length; i++) {
        if (props.text.indexOf(chars[i]) > -1) {
            let a = props.text.split(chars[i]);
            left = a[0];
            middle = chars[i];
            right = a[1];
            break;
        }
    }
    return (
        <View style={[props.style, {flexDirection: 'row', flex: 1}]}>
            <Text style={[props.style, {flex: 25, textAlign: 'right'}]}>{left}</Text>
            <Text style={[props.style, {flex: 1, textAlign: 'center'}]}>{middle}</Text>
            <Text style={[props.style, {flex: 20, textAlign: 'left'}]}>{right}</Text>
        </View>
    );
}

export default Cell;