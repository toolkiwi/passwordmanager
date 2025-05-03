import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import ReduxStore, { StorePersistor } from './redux/StoreRedux.ts';
import { BrowserRouter } from 'react-router';
import '@/translations/Translate.ts';
import { Tooltip } from 'react-tooltip';
import DevToolWarning from './components/DevtoolWarning.tsx';
import { PersistGate } from 'redux-persist/integration/react';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={ReduxStore}>
            <PersistGate loading={null} persistor={StorePersistor}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </PersistGate>
        </Provider>
        <Tooltip
            id='default-tooltip'
            noArrow
            style={{ borderRadius: 8, zIndex: 10000 }}
            delayShow={400}
        />
        <DevToolWarning />
    </StrictMode>,
);
