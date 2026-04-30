import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext.jsx';
import Layout from './components/Layout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import EditPage from './pages/EditPage.jsx';
import NuevoArticuloPage from './pages/NuevoArticuloPage.jsx';
import SocialCalendarPage from './pages/SocialCalendarPage.jsx';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/edit/:slug" element={<EditPage />} />
            <Route path="/nuevo" element={<NuevoArticuloPage />} />
            <Route path="/social" element={<SocialCalendarPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ToastProvider>
  );
}
