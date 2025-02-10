import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { router } from './routers/router';
import { StoreProvider } from './hooks/useStore';
import RootStore from './stores';

import './styles/index.scss';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <StoreProvider store={new RootStore()}>
            <RouterProvider router={router} />
        </StoreProvider>
    </React.StrictMode>
);
