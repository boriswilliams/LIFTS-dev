import { TouchableOpacity, Text } from 'react-native';

import styles from '../utils/styles';
import { getStyle, TEXT_SIZE } from '../utils/styles';
import { globalStyle } from '../utils/styles';

type buttonProps = {
    onPress: () => void;
    title: string;
    bold?: boolean;
}

const Button: React.FC<buttonProps> = (props: buttonProps) => {
    let style: globalStyle = getStyle();
    style.color = style.accent;
    style.backgroundColor = 'rgba(0, 0, 0, 0.0)';
    return (
        <TouchableOpacity style={[style, styles.buttonStyle]} onPress={props.onPress}>
            <Text style={[style, props.bold && {fontSize: TEXT_SIZE*1.5}, {textAlign: 'center'}]}>{props.title}</Text>
        </TouchableOpacity>
    )
}

export default Button;