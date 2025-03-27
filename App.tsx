import ContextProvider from './app/context';
import Navigator from './app/navigator';
import { checkLoadInitialData } from './storage/_helpers';

export default function App() {
    checkLoadInitialData();
    return (
        <ContextProvider>
            <Navigator/>
        </ContextProvider>
    );
}