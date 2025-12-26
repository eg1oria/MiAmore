'use client';

import { useEffect, useState } from 'react';

const mas = ['паоало', 'djflksjf', 'dsdfkljsd', 'skdjflkj'];

export default function Todo() {
  const [value, setValue] = useState('');
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), 300);
    return () => clearTimeout(id);
  }, [value]);

  const filtered = mas.filter((item) => item.includes(debounced));

  return (
    <>
      {filtered.map((item) => (
        <p key={item}>{item}</p>
      ))}
      <input value={value} onChange={(e) => setValue(e.target.value)} />
    </>
  );
}
