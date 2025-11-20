import { useState } from 'react';
import './Quest.css';

export default function Quest() {
  const [open, setOpen] = useState(false);

  return (
    <div className="wrapper">
      <h2 onClick={() => setOpen((prev) => !prev)}>Есть вопросы?</h2>

      <div className={`answer ${open ? 'open' : ''}`}>
        <div className="answer-inner">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet laborum odio porro
          blanditiis dolores sapiente enim tenetur sequi numquam earum, soluta iusto eum, culpa a
          eligendi quidem totam? Rem, incidunt!
        </div>
      </div>
    </div>
  );
}
