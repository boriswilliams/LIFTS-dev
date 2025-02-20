import { useEffect, useState } from 'react';
import { View, TextInput, Text } from 'react-native';

import { getStyle } from '../utils/styles';
import { exportData, importData } from '../storage/_helpers';
import Button from '../components/button';
import { screenProps } from './_types';

const JSON: React.FC<screenProps> = (props: screenProps) => {
    const [data, setData] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    useEffect(() => {
        props.setHeaderRight(undefined);
        if (props.getProps().data !== undefined) {
            setMessage('Save failed, check syntax');
            setData(props.getProps().data);
        } else {
            exportData().then((data) => { setData(data); });
        }
    }, []);
    return (
        <View style={[getStyle(), {flex: 1}]}>
            <TextInput
                style={[getStyle(), {flex: 1, fontFamily: 'monospace'}]}
                onChangeText={setData}
                value={data}
                multiline={true}
            />
            {message !== '' && <Text style={getStyle()}>{message}</Text>}
            <Button
                title="Save edits"
                onPress={async () => {
                    props.getProps()['data'] = data;
                    props.newProps({
                        execute: async () => { await importData(data).then((success) => {success && props.goBack(1);}); },
                        getName: async () => 'edits',
                        backDistance: 1,
                        action: 'save',
                    });
                    props.newPage('Confirm');
                }}
            />
        </View>
    );
}

export default JSON;