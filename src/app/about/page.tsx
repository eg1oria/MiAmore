import AboutPage from '@/components/AboutPage/AboutPage';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AboutPage />
    </ErrorBoundary>
  );
}
