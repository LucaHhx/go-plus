import { AppProvider, useApp, useAuth } from './context/AppContext';
import AppShell from './components/layout/AppShell';
import Login from './components/pages/Login';
import Toast from './components/ui/Toast';

function AppInner() {
  const { state } = useApp();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <>
      <AppShell />
      <Toast
        message={state.toast.message}
        variant={state.toast.variant}
        visible={state.toast.visible}
      />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
