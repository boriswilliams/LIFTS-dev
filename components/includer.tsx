import { ReactNode, useEffect, useState } from 'react';
import { View } from 'react-native';

import { hashSet } from '../utils/_types';
import Item from './item';
import { getStyle } from '../utils/styles';
import List from './/list';

async function getLists(
    loadIncluded: () => Promise<hashSet>,
    loadAll: () => Promise<number[]>,
    setIncludedSet: (x: hashSet) => void,
    setIncluded: (x: number[]) => void,
    setExcluded: (x: number[]) => void
) {
    loadIncluded().then(includedSet => {
        setIncludedSet(includedSet);
        let included: number[] = [];
        for (let item in includedSet) {
            included.push(Number(item));
        }
        setIncluded(included);
        loadAll().then(exerciseList => {
            let excluded: number[] = [];
            for (let item of exerciseList) {
                if (!(item in includedSet)) {
                    excluded.push(item);
                }
            }
            setExcluded(excluded);
        });
    });
}

async function updateParentItems(parent: number, included: number[], excluded: number[], includedSet: hashSet, deleteParentItem: (day: number, exercise: number) => Promise<void>, addParentItem: (day: number, exercise: number) => Promise<void>): Promise<void> {
    for (let item of excluded)
        if (item in includedSet)
            await deleteParentItem(parent, item);
    for (let item of included)
        if (!(item in includedSet))
            await addParentItem(parent, item);
}

const move = (index: number, start: number[], setStart: (x: number[]) => void, dest: number[], setDest: (x: number[]) => void) => {
    start = [...start]
    dest = [...dest]
    let item: number | undefined = start[index];
    if (item !== undefined) {
        start.splice(index, 1)
        dest.push(item);
    }
    setStart(start);
    setDest(dest);
}

type includerProps = {
    loadName: (x: number) => Promise<string>;
    included: number[];
    setIncluded: (x: number[]) => void;
    excluded: number[];
    setExcluded: (x: number[]) => void;
    customExcludedTitle?: string;
}

const Includer: React.FC<includerProps> = (props: includerProps) => {
    const {
        loadName,
        included,
        setIncluded,
        excluded,
        setExcluded,
        customExcludedTitle
    } = props;
    return (
        <View style={[getStyle(), {flex: 1}, {flexDirection: 'row'}]}>
            <List
                style={[getStyle(), {flex: 1},]}
                data={included}
                ListHeaderComponent={<Item text={'Included'}/>}
                renderItem={({index, item, style}) => {
                    return (
                        <Item
                            getText={() => loadName(item)}
                            onPress={() => {
                                move(index, included, setIncluded, excluded, setExcluded);
                            }}
                            style={style}
                        />
                    )
                }}
                keyExtractor={(item) => String(item)}
                separator={true}
            />
            <List
                style={[getStyle(), {flex: 1},]}
                data={excluded}
                ListHeaderComponent={<Item text={customExcludedTitle || 'Excluded'}/>}
                renderItem={({index, item, style}) => {
                    return (
                        <Item
                            getText={() => loadName(item)}
                            onPress={() => {
                                move(index, excluded, setExcluded, included, setIncluded);
                            }}
                            style={style}
                        />
                    )
                }}
                keyExtractor={(item) => String(item)}
                separator={true}
            />
        </View>
    );
}

export default Includer;

export { updateParentItems, getLists };