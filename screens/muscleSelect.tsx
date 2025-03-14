import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { loadMuscleName, loadMuscleList } from '../storage/muscles';
import { hashSet } from '../utils/_types';
import Button from '../components/button';
import { screenProps } from './_types';
import Includer, { getLists } from '../components/includer';

const MuscleSelect: React.FC<screenProps> = (props: screenProps) => {
    const [includedSet, setIncludedSet] = useState<hashSet>({});
    const [included, setIncluded] = useState<number[]>([]);
    const [excluded, setExcluded] = useState<number[]>([]);
    useEffect(() => {
        props.makeSwitchButton();
        props.setHeaderRight(undefined);
    }, []);
    useEffect(() => {
        getLists(props.getProps().loadIncluded!, loadMuscleList, setIncludedSet, setIncluded, setExcluded);
    }, []);
    return (
        <View style={{flex: 1}}>
            <Includer
                loadName={loadMuscleName}
                included={included}
                setIncluded={setIncluded}
                excluded={excluded}
                setExcluded={setExcluded}
            />
            <Button
                title="Save"
                onPress={async () => {
                    await props.getProps().updateMuscles!(included, excluded, includedSet);
                    props.goBack();
                }}
            />
        </View>
    );
}

export default MuscleSelect;