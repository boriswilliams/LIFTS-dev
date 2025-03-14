import { load, save } from './_helpers';

const bodyWeight = () => 'bodyweight';
const loadBodyWeight = async (): Promise<number> => Number(await load(bodyWeight(), 41.2));
const saveBodyWeight = async (val: number): Promise<void> => await save(bodyWeight(), val);

const theme = () => 'theme';
const loadTheme = async (): Promise<string> => String(await load(theme(), 'light'));
const saveTheme = async (val: string): Promise<void> => await save(theme(), val);

export { loadBodyWeight, saveBodyWeight, loadTheme, saveTheme };