import { atom } from 'jotai';


export const SelectedQuery = atom<[string, number]>(["", 0]);