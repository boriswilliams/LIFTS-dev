import { Pressable } from 'react-native';

import { getStyle } from '../utils/styles';
import Item from './item';
import { globalStyle } from '../utils/styles';

type listItemProps = {
    text?: string;
    getText?: () => Promise<string>;
    onPress?: () => void;
    selected?: boolean;
    style?: {};
}

const BORDER_RADIUS = 5;

const ListItem: React.FC<listItemProps> = (props: listItemProps) => {
    let style: globalStyle = getStyle();
    if (props.selected !== undefined) {
        style.borderWidth = 1;
        if (props.selected) {
            style.borderTopLeftRadius = BORDER_RADIUS;
            style.borderTopRightRadius = BORDER_RADIUS;
            style.borderTopColor = style.accent;
            style.borderLeftColor = style.accent;
            style.borderRightColor = style.accent;
            style.borderBottomColor = style.backgroundColor;
        } else {
            style.backgroundColor = style.backgroundDark;
            style.borderBottomColor = style.accent;
        }
    }
    return (
        <Pressable
            style={[{flex: 1}, style]}
            onPress={props.onPress}
        >
            <Item
                text={props.text}
                getText={props.getText}
                style={[style, props.style]}
            />
        </Pressable>
    )
}

export default ListItem;