import './App.css';
import { AppRoutes } from './routes';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AuthProvider } from '@/providers/AuthProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { ReduxProvider } from '@/providers/ReduxProvider';
import { ToastContainer } from 'react-toastify';
import { ErrorBoundary } from '@/components/auth';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <ReduxProvider>
      <QueryProvider>
        <ErrorBoundary>
          <AuthProvider>
            <SidebarProvider>
              <AppRoutes />
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </SidebarProvider>
          </AuthProvider>
        </ErrorBoundary>
      </QueryProvider>
    </ReduxProvider>
  );
}

export default App;
