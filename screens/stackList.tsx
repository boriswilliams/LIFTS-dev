import { useEffect, useState } from 'react';

import { getStyle, globalStyle } from '../utils/styles';
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
            renderItem={({index, item, style}) => {
                return (
                    <ListItem
                        getText={() => loadStackName(item)}
                        onPress={() => {
                            props.newProps({
                                stack: item
                            });
                            props.newPage('Stack');
                        }}
                        style={style}
                    />
                )
            }}
            ListFooterComponent={(style: globalStyle) => {
                style.color = style.accent;
                return (
                    <ListItem text={"New stack"}
                        onPress={async (): Promise<void> => {
                            let newStack = await saveNewStack();
                            props.disableBack!(true);
                            props.newProps({
                                stack: newStack,
                            });
                            props.newPage('Stack');
                        }}
                        style={style}
                    />
                );
            }}
            separator={true}
        />
    );
}

export default StackList;