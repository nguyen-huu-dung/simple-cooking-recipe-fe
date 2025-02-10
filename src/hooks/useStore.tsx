import RootStore from '@/stores';
import React, { useContext } from 'react';

const StoreContext = React.createContext<RootStore>({} as RootStore);

interface StoreProviderProps {
    store: RootStore,
    children: React.ReactNode
}

export const StoreProvider = ({ children, store }: StoreProviderProps) => {
    return (
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    );
};

export const useStore = (): RootStore => {
    const store = useContext(StoreContext);
    return store;
};
