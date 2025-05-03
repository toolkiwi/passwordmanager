import { Route, Routes } from 'react-router';

import IndexPage from './pages/Index';

import VaultDashboardPage from './pages/Vault/Dashboard';
import VaultTrashPage from './pages/Vault/Trash';
import VaultCreatePage from './pages/Vault/Create';
import VaultSettingsPage from './pages/Vault/Settings';
import VaultPasswordPage from './pages/Vault/Password';
import VaultPasswordEditPage from './pages/Vault/Password/edit';
import ChangelogPage from './pages/Changelog';

import DefaultLayout from './layouts/DefaultLayout';

function App() {
    return (
        <Routes>
            <Route index element={<IndexPage />} />
            <Route element={<DefaultLayout />}>
                <Route path='vault' element={<VaultDashboardPage />} />
                <Route path='vault/trash' element={<VaultTrashPage />} />
                <Route path='vault/create' element={<VaultCreatePage />} />
                <Route path='vault/settings' element={<VaultSettingsPage />} />
                <Route
                    path='vault/password/:uuid'
                    element={<VaultPasswordPage />}
                />
                <Route
                    path='vault/password/:uuid/edit'
                    element={<VaultPasswordEditPage />}
                />
            </Route>
            <Route path='changelog' element={<ChangelogPage />} />
        </Routes>
    );
}

export default App;
