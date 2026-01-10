import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import dynamic from 'next/dynamic';

const Catalog = dynamic(() => import('@/components/Catalog/Catalog'), {
  loading: () => <div className="loader"></div>,
});

export default function App() {
  return (
    <div className="container">
      <ErrorBoundary>
        <div
          style={{
            marginTop: '100px',
          }}>
          <Catalog />
        </div>
      </ErrorBoundary>
    </div>
  );
}
