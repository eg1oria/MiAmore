import dynamic from 'next/dynamic';

const ContactsPage = dynamic(() => import('@/components/ContactsPage/ContactsPage'), {
  loading: () => <div className="loader"></div>,
});
export default function App() {
  return <ContactsPage />;
}
