import AboutPage from '@/components/AboutPage/AboutPage';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import MapPage from '@/components/MapPage.tsx/MapPage';
import ReviewPage from '@/components/ReviewPage/ReviewPage';

export default function App() {
  return (
    <ErrorBoundary>
      <div className="container">
        <AboutPage />

        <MapPage />
        <ReviewPage />
      </div>
    </ErrorBoundary>
  );
}
