import { useEffect, useState, useContext } from 'react';
import { View, Button } from 'react-native';

import { screenProps } from '../utils/types';
import { loadBodyWeight, saveBodyWeight, saveTheme } from '../storage/profile';
import InputNum from '../components/inputNum';
import Selector from '../components/selector';
import { STYLES, getStyle } from '../utils/styles';
import { globalContext } from '../context';

const Profile: React.FC<screenProps> = (props: screenProps) => {
    const [bodyweight, setBodyweight] = useState(0);
    const [style, setStyle] = useState(0);
    let context = useContext(globalContext)
    useEffect(() => {
        props.setHeaderRight(undefined)
        loadBodyWeight().then(result => { setBodyweight(result) });
        setStyle(STYLES.indexOf(context.state.theme));
    }, []);
    return (
        <View style={[getStyle(), {flex: 1}]}>
            <InputNum
                value={bodyweight}
                changeValue={setBodyweight}
                title={'bodyweight'}
                delta={1}
            />
            <Button
                title="Save"
                onPress={async () => {
                    await saveBodyWeight(bodyweight);
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
        </View>
    );
}

export default Profile;