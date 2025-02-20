import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import Button from '../components/button';
import { getStyle } from '../utils/styles';
import { screenProps } from './_types';

const Confirm: React.FC<screenProps> = (props: screenProps) => {
    const [name, setName] = useState('');
    useEffect(() => {
        props.setHeaderRight(undefined);
        props.getProps().getName!().then((name: string): void => { setName(name); });
    }, []);
    return (
        <View style={[getStyle(), {flex: 1}]}>
            <Text style={getStyle()}>{`Are you sure you want to ${props.getProps().action} ${name}?`}</Text>
            <Button
                title="Confirm"
                onPress={async () => {
                    await props.getProps().execute!();
                    props.goBack(props.getProps().backDistance!);
                }}
            />
        </View>
    );
}

export default Confirm;