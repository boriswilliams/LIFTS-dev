import { SafeAreaView, View, StatusBar } from 'react-native';
import { useState } from 'react';

import Exercise from '../screens/exercise/exercise';
import ExerciseList from '../screens/exerciseList';
import DayList from '../screens/dayList';
import ExerciseSettings from '../screens/exerciseSettings';
import DaySettings from '../screens/daySettings';
import Confirm from '../screens/confirm';
import Profile from '../screens/profile';
import ContextProvider from './context';
import { getStyle, APP_NAME } from '../utils/styles';
import JSON from '../screens/json';
import NavigationBar from '../components/navigationBar';
import Stacks from '../screens/stackList';
import Stack from '../screens/stack';
import { navigatorProps } from './_types';

const Navigator: React.FC = () => {
    const [title, setTitle] = useState(APP_NAME);
    const [page, setPage] = useState(['DayList']);
    const [props, setProps] = useState([{}]);
    const [headerRight, setHeaderRight] = useState<React.JSX.Element|undefined>(undefined);
    const [backDisabled, disableBack] = useState<boolean>(false);
    const getPage = (): string => page[page.length-1];
    const newPage = (s: string): void => setPage([...page, s]);
    const getProps = (): navigatorProps => props[props.length-1];
    const newProps = (p: navigatorProps): void => setProps([...props, p]);
    const goBack = (x:number=1): void => {
        if (x < 1)
            throw new Error(`Bad back parameter: ${1}`);
        setPage((a) => a.slice(0, -x));
        setProps((a) => a.slice(0, -x));
    }
    return (
        <ContextProvider>
            <SafeAreaView style={{width: '100%', height: '100%', marginTop:StatusBar.currentHeight}}>
                <NavigationBar title={title} page={page} headerRight={headerRight} goBack={goBack} backDisabled={backDisabled}/>
                <View
                    style={[getStyle(), {flex: 1}]}
                >
                    {getPage() == 'DayList' && <DayList newPage={newPage} newProps={newProps} getProps={getProps} setTitle={setTitle} setHeaderRight={setHeaderRight} goBack={goBack} disableBack={disableBack}/>}
                    {getPage() == 'ExerciseList' && <ExerciseList newPage={newPage} newProps={newProps} getProps={getProps} setTitle={setTitle} setHeaderRight={setHeaderRight} goBack={goBack} disableBack={disableBack}/>}
                    {getPage() == 'Exercise' && <Exercise newPage={newPage} newProps={newProps} getProps={getProps} setTitle={setTitle} setHeaderRight={setHeaderRight} goBack={goBack}/>}
                    {getPage() == 'ExerciseSettings' && <ExerciseSettings newPage={newPage} newProps={newProps} getProps={getProps} setTitle={setTitle} setHeaderRight={setHeaderRight} goBack={goBack} backDisabled={backDisabled}/>}
                    {getPage() == 'DaySettings' && <DaySettings newPage={newPage} newProps={newProps} getProps={getProps} setTitle={setTitle} setHeaderRight={setHeaderRight} goBack={goBack} backDisabled={backDisabled}/>}
                    {getPage() == 'Confirm' && <Confirm newPage={newPage} newProps={newProps} getProps={getProps} setTitle={setTitle} setHeaderRight={setHeaderRight} goBack={goBack}/>}
                    {getPage() == 'Profile' && <Profile newPage={newPage} newProps={newProps} getProps={getProps} setTitle={setTitle} setHeaderRight={setHeaderRight} goBack={goBack}/>}
                    {getPage() == 'JSON' && <JSON newPage={newPage} newProps={newProps} getProps={getProps} setTitle={setTitle} setHeaderRight={setHeaderRight} goBack={goBack}/>}
                    {getPage() == 'Stacks' && <Stacks newPage={newPage} newProps={newProps} getProps={getProps} setTitle={setTitle} setHeaderRight={setHeaderRight} goBack={goBack} disableBack={disableBack}/>}
                    {getPage() == 'Stack' && <Stack newPage={newPage} newProps={newProps} getProps={getProps} setTitle={setTitle} setHeaderRight={setHeaderRight} goBack={goBack} backDisabled={backDisabled}/>}
                </View>
            </SafeAreaView>
        </ContextProvider>
    );
}

export default Navigator;