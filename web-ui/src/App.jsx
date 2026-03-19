import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppStateProvider } from './hooks/useAppState';
import ErrorBoundary from './components/ErrorBoundary';
import BackgroundLayout from './layouts/BackgroundLayout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import RegimeExplorer from './pages/RegimeExplorer';
import Simulations from './pages/Simulations';
import Methodology from './pages/Methodology';
import Assets from './pages/Assets';
import About from './pages/About';
import RegimeTester from './pages/RegimeTester';

/**
 * App Component
 * Root with providers and routing configuration
 */
function App() {
  return (
    <BrowserRouter>
      <AppStateProvider>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Persistent Layout for internal pages */}
            <Route element={<BackgroundLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/explorer" element={<RegimeExplorer />} />
              <Route path="/simulations" element={<Simulations />} />
              <Route path="/methodology" element={<Methodology />} />
              <Route path="/about" element={<About />} />
              <Route path="/regime-tester" element={<RegimeTester />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </AppStateProvider>
    </BrowserRouter>
  );
}

export default App;
