import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import Flowers from '@/components/Flowers/Flowers';

export default function App() {
  return (
    <div className="container">
      <h1
        style={{
          fontSize: '40px',
          fontWeight: 'bold',
          margin: '20px 0 25px 0',
        }}>
        Каталог
      </h1>
      <ErrorBoundary>
        <Flowers />
      </ErrorBoundary>
    </div>
  );
}
