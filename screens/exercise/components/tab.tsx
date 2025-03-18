import { Pressable } from 'react-native';

import { getStyle } from '../../../utils/styles';
import Item from '../../../components/item';
import { globalStyle, BORDER_WIDTH } from '../../../utils/styles';

type tabProps = {
    text: string;
    onPress: () => void;
    style: {};
    index: number;
    length: number;
    selected: number;
}

const BORDER_RADIUS = 5;

const Tab: React.FC<tabProps> = (props: tabProps) => {
    const border_width = BORDER_WIDTH / 2;
    const style: globalStyle = getStyle();
    style.borderTopLeftRadius = BORDER_RADIUS;
    style.borderTopRightRadius = BORDER_RADIUS;
    const outerStyle: any = {
        borderColor: style.backgroundDark,
        borderTopWidth: border_width,
        borderBottomWidth: border_width,
    };
    if (props.index == props.selected) {
        outerStyle.borderTopColor = style.accent;
        outerStyle.borderLeftColor = style.accent;
        outerStyle.borderRightColor = style.accent;
        outerStyle.borderBottomColor = style.backgroundColor;
        if (props.index > 0) {
            outerStyle.borderLeftWidth = border_width;
        }
        if (props.index < props.length-1) {
            outerStyle.borderRightWidth = border_width;
        }
    } else {
        style.backgroundColor = style.backgroundMid;
        outerStyle.borderTopColor = style.backgroundMid;
        outerStyle.borderBottomColor = style.accent;
    }
    return (
        <Pressable
            style={[{flex: 1}, style, outerStyle]}
            onPress={props.onPress}
        >
            <Item
                text={props.text}
                style={[style, props.style]}
            />
        </Pressable>
    )
}

export default Tab;