import { useEffect, useState } from 'react';
import { View, TextInput, Text } from 'react-native';

import Button from '../components/button';
import { getStyle, DEFAULT_PADDING } from '../utils/styles';
import { deleteStack, loadStackData, loadStackName, saveStackData, saveStackName } from '../storage/stacks';
import { screenProps } from './_types';

const Stack: React.FC<screenProps> = (props: screenProps) => {
    const [name, setName] = useState<string>('');
    const [data, setData] = useState<string>(String([]));
    const [message, setMessage] = useState<string>('');
    useEffect(() => {
        props.setHeaderRight(
            <Button
                title={'Delete'}
                onPress={() => {
                    props.newProps({
                        execute: async () => { await deleteStack(props.getProps().stack!) },
                        getName: async () => await loadStackName(props.getProps().stack!),
                        backDistance: 2,
                        action: 'delete',
                    });
                    props.newPage('Confirm');
                }}
            />
        )
        loadStackData(props.getProps().stack!).then(data => { setData(String(data)); });
        loadStackName(props.getProps().stack!).then(result => { setName(result); });
    }, []);
    return (
        <View style={[getStyle(), {flex: 1}]}>
            <TextInput style={[getStyle(), {padding: DEFAULT_PADDING}]} value={name} onChangeText={setName}/>
            <TextInput style={[getStyle(), {fontFamily: 'monospace', flex: 1, textAlignVertical: 'top'}]} value={data} onChangeText={setData} multiline={true}/>
            {message !== '' && <Text style={getStyle()}>{message}</Text>}
            <Button
                title="Save"
                onPress={async () => {
                    const array = data.split(',');
                    let isValid = array.every((item) => !isNaN(Number(item.trim())));
                    if (isValid) {
                        for (let i = 1; i < array.length; i++) {
                            if (array[i-1] >= array[i]) {
                                isValid = false;
                                break;
                            }
                        }
                    }
                    if (isValid) {
                        await saveStackName(props.getProps().stack!, name);
                        await saveStackData(props.getProps().stack!, JSON.parse(`[${data}]`));
                        props.goBack();
                    } else {
                        console.error('Bad array input.');
                        setMessage('Save failed, syntax: x,y,z (increasing)');
                    }
                }}
            />
        </View>
    );
}

export default Stack;