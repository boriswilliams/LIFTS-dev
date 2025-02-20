import { Text, View, Pressable } from 'react-native';
import Checkbox from 'expo-checkbox';

import { getStyle, DEFAULT_PADDING } from '../utils/styles';
import { titleCase } from '../utils/utils';

type selectorProps = {
    selected: number;
    setSelected: (x: number) => void;
    data: string[];
}

const Selector: React.FC<selectorProps> = (props: selectorProps) => {
    return (
        <View style={[getStyle(), {width: '100%'}]}>
            {props.data.map((item, index) => {
                return (
                    <Pressable
                        style={[getStyle(), {flexDirection: 'row', alignItems: 'center', paddingLeft: DEFAULT_PADDING}]}
                        key={index}
                        onPress={() => { props.setSelected(index); }}
                    >
                        <Checkbox
                            value={index==props.selected}
                        />
                        <Text style={[getStyle(), {padding: DEFAULT_PADDING}]}>{titleCase(item)}</Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

export default Selector;