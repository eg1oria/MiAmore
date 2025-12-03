import AboutPage from '@/components/AboutPage/AboutPage';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import Map from '@/components/Map/Map';

export default function App() {
  return (
    <ErrorBoundary>
      <AboutPage />
      <Map />
    </ErrorBoundary>
  );
}
