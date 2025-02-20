import { useEffect, useState, useContext } from 'react';
import { View } from 'react-native';

import { loadBodyWeight, saveBodyWeight, saveTheme } from '../storage/profile';
import InputNum from '../components/inputNum';
import Selector from '../components/selector';
import { STYLES, getStyle } from '../utils/styles';
import { globalContext } from '../app/context';
import Button from '../components/button';
import { screenProps } from './_types';

const Profile: React.FC<screenProps> = (props: screenProps) => {
    const [bodyweight, setBodyweight] = useState<string>(String(0));
    const [style, setStyle] = useState(0);
    let context = useContext(globalContext)
    useEffect(() => {
        props.setHeaderRight(undefined)
        loadBodyWeight().then(result => { setBodyweight(String(result)) });
        setStyle(STYLES.indexOf(context.state.theme));
    }, []);
    return (
        <View style={[getStyle(), {flex: 1}]}>
            <InputNum
                value={bodyweight}
                changeValue={setBodyweight}
                title={'bodyweight'}
                delta={1}
                decimals={true}
            />
            <Button
                title="Save"
                onPress={async () => {
                    await saveBodyWeight(Number(bodyweight));
                    props.goBack();
                }}
            />
            <Selector
                data={STYLES}
                selected={style}
                setSelected={(index) => {
                    setStyle(index);
                    context.setState({
                        theme: STYLES[index],
                    });
                    saveTheme(STYLES[index]);
                }}
            />
            <Button
                title="Edit weight stacks"
                onPress={async () => {
                    props.newProps({});
                    props.newPage('Stacks');
                }}
            />
            <Button
                title="Edit JSON data"
                onPress={async () => {
                    props.newProps({});
                    props.newPage('JSON');
                }}
            />
        </View>
    );
}

export default Profile;