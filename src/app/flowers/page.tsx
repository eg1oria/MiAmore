import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import dynamic from 'next/dynamic';

const Flowers = dynamic(() => import('@/components/Flowers/Flowers'), {
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
          <Flowers slicedNum={44} titleText="Каталог" />
        </div>
      </ErrorBoundary>
    </div>
  );
}
