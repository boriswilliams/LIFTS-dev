import { Text } from 'react-native';
import { useEffect, useState } from 'react';

import { getStyle } from '../utils/styles';
import styles from '../utils/styles';

type itemProps = {
    text?: string;
    getText?: () => Promise<string>;
    style?: {};
}

const Item: React.FC<itemProps> = (props: itemProps) => {
    const [text, setText] = useState(props.text);
    useEffect(() => {
        if (props.getText)
            props.getText().then((result) => { setText(result) });
    }, []);
    let style = props.style || getStyle();
    return (
        <Text style={[style, {flex: 1}, styles.listItemText, {paddingLeft: 5}]}>{text}</Text>
    )
}

export default Item;