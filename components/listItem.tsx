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

const ListItem: React.FC<listItemProps> = (props: listItemProps) => {
    let style: globalStyle = getStyle();
    if (props.selected !== undefined) {
        if (props.selected) {
            style.borderTopLeftRadius = 5;
            style.borderTopRightRadius = 5;
        } else {
            style.backgroundColor = style.backgroundDark;
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