import { Navigate, Route, Routes } from 'react-router';

import IndexPage from './pages/Index';

import VaultDashboardPage from './pages/Vault/Dashboard';
import VaultTrashPage from './pages/Vault/Trash';
import VaultTagsPage from './pages/Vault/Tags';
import VaiultTagCreatePage from './pages/Vault/Tags/create';
import VaiultTagEditPage from './pages/Vault/Tags/edit';
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
                <Route
                    path='vault/'
                    element={<Navigate to='/vault/passwords' replace />}
                />
                <Route
                    path='vault/passwords'
                    element={<VaultDashboardPage />}
                />
                <Route
                    path='vault/passwords/create'
                    element={<VaultCreatePage />}
                />
                <Route
                    path='vault/passwords/:uuid'
                    element={<VaultPasswordPage />}
                />
                <Route
                    path='vault/passwords/:uuid/edit'
                    element={<VaultPasswordEditPage />}
                />
                <Route path='vault/trash' element={<VaultTrashPage />} />
                <Route path='vault/settings' element={<VaultSettingsPage />} />
                <Route path='vault/tags' element={<VaultTagsPage />} />
                <Route
                    path='vault/tags/create'
                    element={<VaiultTagCreatePage />}
                />
                <Route
                    path='vault/tags/:uuid/edit'
                    element={<VaiultTagEditPage />}
                />
            </Route>
            <Route path='changelog' element={<ChangelogPage />} />
        </Routes>
    );
}

export default App;
