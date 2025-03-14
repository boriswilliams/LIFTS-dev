import { Pressable } from 'react-native';

import { getStyle } from '../../../utils/styles';
import Item from '../../../components/item';
import { globalStyle, BORDER_WIDTH } from '../../../utils/styles';

type tabProps = {
    text: string;
    onPress: () => void;
    selected: boolean;
    style: {};
    left: boolean;
    right: boolean;
}

const BORDER_RADIUS = 5;

const Tab: React.FC<tabProps> = (props: tabProps) => {
    const border_width = BORDER_WIDTH / 2;
    const style: globalStyle = getStyle();
    const extraStyle: any = {
        borderColor: style.backgroundDark,
        borderTopWidth: border_width,
        borderBottomWidth: border_width,
    };
    if (props.selected) {
        extraStyle.borderTopLeftRadius = BORDER_RADIUS;
        extraStyle.borderTopRightRadius = BORDER_RADIUS;
        extraStyle.borderTopColor = style.accent;
        if (!props.left) {
            extraStyle.borderLeftWidth = border_width;
            extraStyle.borderLeftColor = style.accent;
        }
        if (!props.right) {
            extraStyle.borderRightWidth = border_width;
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