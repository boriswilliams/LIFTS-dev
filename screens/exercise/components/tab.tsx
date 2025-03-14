import { Pressable } from 'react-native';

import { getStyle } from '../../../utils/styles';
import Item from '../../../components/item';
import { globalStyle } from '../../../utils/styles';

type tabProps = {
    text: string;
    onPress: () => void;
    selected: boolean;
    style: {};
    left: boolean;
    right: boolean;
}

const BORDER_RADIUS = 5;
const BORDER_WIDTH = 1;

const Tab: React.FC<tabProps> = (props: tabProps) => {
    const style: globalStyle = getStyle();
    const extraStyle: any = {
        borderColor: style.backgroundDark,
        borderTopWidth: BORDER_WIDTH,
        borderBottomWidth: BORDER_WIDTH,
    };
    if (props.selected) {
        extraStyle.borderTopLeftRadius = BORDER_RADIUS;
        extraStyle.borderTopRightRadius = BORDER_RADIUS;
        extraStyle.borderTopColor = style.accent;
        if (!props.left) {
            extraStyle.borderLeftWidth = BORDER_WIDTH;
            extraStyle.borderLeftColor = style.accent;
        }
        if (!props.right) {
            extraStyle.borderRightWidth = BORDER_WIDTH;
            extraStyle.borderRightColor = style.accent;
        }
        extraStyle.borderBottomColor = style.backgroundColor;
    } else {
        extraStyle.backgroundColor = style.backgroundDark;
        extraStyle.borderBottomColor = style.accent;
    }
    return (
        <Pressable
            style={[{flex: 1}, style, extraStyle]}
            onPress={props.onPress}
        >
            <Item
                text={props.text}
                style={[style, extraStyle, props.style]}
            />
        </Pressable>
    )
}

export default Tab;