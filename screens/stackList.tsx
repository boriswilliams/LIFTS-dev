import { useEffect, useState } from 'react';

import { getStyle } from '../utils/styles';
import ListItem from '../components/listItem';
import { hashSet } from '../utils/_types';
import List from '../components/list';
import { loadStacks, loadStackName, saveNewStack } from '../storage/stacks';
import { screenProps } from './_types';

const StackList: React.FC<screenProps> = (props: screenProps) => {
    const [stackList, setStackList] = useState<number[]>([]);
    useEffect(() => {
        props.setHeaderRight(undefined)
        props.disableBack!(false);
        loadStacks().then((result: hashSet) => {
            let stackList: number[] = [];
            for (let key in result) {
                stackList.push(Number(key));
            }
            setStackList(stackList);
        });
    }, []);
    return (
        <List
            style={[getStyle(), {flex: 1},]}
            data={stackList}
            renderItem={({item}) => {
                return (
                    <ListItem
                        getText={() => loadStackName(item)}
                        onPress={() => {
                            props.newProps({
                                stack: item
                            });
                            props.newPage('Stack');
                        }}
                    />
                )
            }}
            ListFooterComponent={
                <ListItem text={"New stack"}
                    onPress={async (): Promise<void> => {
                        let newStack = await saveNewStack();
                        props.disableBack!(true);
                        props.newProps({
                            stack: newStack,
                        });
                        props.newPage('Stack');
                    }}
                    style={{color: getStyle().accent}}
                />
            }
        />
    );
}

export default StackList;