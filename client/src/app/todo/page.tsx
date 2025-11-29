'use client';

import { useState } from 'react';
import './todo.css';

export default function Home() {
  const [titles, setTitles] = useState<string[]>([]);
  const [titlesValue, setTitlesValue] = useState('');
  const [desks, setDesks] = useState<string[]>([]);
  const [desksValue, setDeskValue] = useState('');

  function handleTitiles(e) {
    setTitlesValue(e.target.value);
  }

  function handleDesk(e) {
    setDeskValue(e.target.value);
  }

  function handleAdd() {
    if (titlesValue === '' || desksValue === '') return;
    setTitles((prev) => [...prev, titlesValue]);
    setDesks((prev) => [...prev, desksValue]);
    setDeskValue('');
    setTitlesValue('');
  }

  function handleDel(i: number) {
    setTitles((prev) => prev.filter((_, index) => index !== i));
  }

  const filtered = [...titles].sort((a, b) => b - a);

  return (
    <div className="container">
      <div className="wrap">
        <div className="content">
          <div className="inputs">
            <label htmlFor="titleid" className="inputtitleLadel">
              <h2 className="titleHead">Введите задачу</h2>
              <input
                className="titleInput"
                id="titleid"
                type="text"
                onChange={handleTitiles}
                value={titlesValue}
              />
            </label>
            <label htmlFor="deskid" className="inputtitleLadel">
              <h2 className="titleHead">Введите инфо</h2>
              <input
                className="titleInput"
                type="text"
                id="deskid"
                onChange={handleDesk}
                value={desksValue}
              />
            </label>
          </div>
          <button className="addButton" onClick={handleAdd}>
            Добавить
          </button>
        </div>

        <ul className="list">
          {filtered.map((t, i) => (
            <li className="listItem" key={i}>
              <div className="listInfo">
                <span className="listTitle">{t}</span>
                <span className="listDesk">{desks[i]}</span>
              </div>
              <button className="buttonMinus" onClick={() => handleDel(i)}>
                Удалить
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
