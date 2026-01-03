import dynamic from 'next/dynamic';

const FlowerId = dynamic(() => import('@/components/Flowers/FlowersId'), {
  loading: () => <div className="loader"></div>,
});

export default function FlowerPage() {
  return <FlowerId />;
}
