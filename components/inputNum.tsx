import { Text, View, TextInput } from 'react-native';

import { round, isNumber } from '../utils/utils';
import { getStyle } from '../utils/styles';
import Button from './button';

type inputNumProps = {
    value: string;
    changeValue: (x: string) => void;
    title: string;
    min?: number;
    max?: number;
    delta: number;
    decimals: boolean;
}

const InputNum: React.FC<inputNumProps> = (props: inputNumProps) => {
    return (
        <View style={[getStyle(), {flexDirection: 'row', justifyContent: 'center'}]}>
            <View style={{flex: 1, justifyContent: 'center'}}>
                <Text style={[getStyle(), {textAlign: 'right'}]}>{`${props.title}:`}</Text>
            </View>
            <View style={{flexDirection: 'row', flex: 2}}>
                <Button bold={true} title='-' onPress={() => {
                    props.changeValue(String(Math.max(props.min || 0, round(Number(props.value) - props.delta))));
                }}/>
                <TextInput
                    style={[getStyle(), {textAlign: 'center'}]}
                    onChangeText={(x: string): void => {
                        isNumber(x)
                            && (props.decimals || !x.includes('.'))
                            && props.changeValue(x);
                    }}
                    value={props.value}
                />
                <Button bold={true} title='+' onPress={() => {
                    props.changeValue(String(Math.min(props.max || 999999, round(Number(props.value) + props.delta))));
                }}/>
            </View>
        </View>
    );
}

export default InputNum;