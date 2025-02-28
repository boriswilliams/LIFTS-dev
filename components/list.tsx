import { ReactNode } from 'react';
import { FlatList, View } from 'react-native';

import { getStyle,  globalStyle } from '../utils/styles';

const ItemSeparatorComponent: React.FC<{}> = (props: {}) => {
    return (
        <View style={{alignItems: 'center'}}>
            <View style={{backgroundColor: getStyle().backgroundDark, height: 1, width: '95%'}} />
        </View>
    );
}

type renderItemArguments = {
    index: number;
    item: any;
    style: globalStyle;
}

type ListProps = {
    style?: object;
    data: ArrayLike<any>;
    renderItem: (x: renderItemArguments) => React.ReactElement;
    ListHeaderComponent?: ReactNode;
    ListFooterComponent?: (x: globalStyle) => ReactNode;
    keyExtractor?: (x: any) => string;
    alternate?: boolean;
    separator?: boolean;
}

const List: React.FC<ListProps> = (props: ListProps) => {
    const { data, renderItem, ListHeaderComponent, ListFooterComponent, keyExtractor, alternate, separator } = props;
    const style = getStyle();
    const alternateStart = ListHeaderComponent ? 0 : 1;
    return (
        <FlatList
            style = {props.style}
            data = {data}
            renderItem = {({item, index}) => {
                const itemStyle = {...style};
                if (alternate && index % 2 == alternateStart)
                    itemStyle.backgroundColor = itemStyle.backgroundMid;
                return renderItem({index, item, style: itemStyle});
            }}
            ListHeaderComponent={
                <View>
                    {ListHeaderComponent}
                    {separator && ListHeaderComponent !== undefined && <ItemSeparatorComponent/>}
                </View>
            }
            ItemSeparatorComponent={separator && ItemSeparatorComponent || null}
            ListFooterComponent={
                <View>
                  {separator && data!.length > 0 && ListFooterComponent !== undefined && <ItemSeparatorComponent/>}
                  {ListFooterComponent !== undefined && (() => {
                    const style = getStyle();
                    if (alternate && data.length == alternateStart)
                        style.backgroundColor = style.backgroundMid;
                    return ListFooterComponent(style);
                  })()}
                </View>
            }
            keyExtractor={keyExtractor}
        />
    )
}

export default List;