import './App.css';
import { AppRoutes } from './routes';
import { SidebarProvider } from '@/components/ui/sidebar';

function App() {
  
  return (
    <SidebarProvider>
      <AppRoutes />
    </SidebarProvider>
  );
}

export default App;
