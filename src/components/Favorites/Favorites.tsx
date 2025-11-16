import { RootState } from '@/app/store';
import { useDispatch, useSelector } from 'react-redux';
import Flowers from '../Flowers/Flowers';
import Image from 'next/image';
import { addToCart, cleanFavs, removeFromCart, removeFromFavs } from '../../features/cartSlice';
import './Favs.css';
import { IFlower } from '@/types/IFlower';
import Link from 'next/link';

export default function Favorites() {
  const { favs } = useSelector((state: RootState) => state.cart);
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const handleAdd = (flower: IFlower) => {
    dispatch(addToCart(flower));
  };

  const handleRemove = (id: number) => {
    dispatch(removeFromCart(id));
  };
  return (
    <div className="container">
      <div className="favs-container">
        <h2 className="favs-title">Избранное</h2>

        {favs.length === 0 ? (
          <p className="favs-empty">Пусто :(</p>
        ) : (
          <div className="favs-list-wrapper">
            <ul className="favs-list">
              {favs.map((item) => {
                const inCart = cart.some((f) => f.id === item.id);
                return (
                  <li key={item.id} className="favs-item">
                    <div className="favs-item-left">
                      <Link href={`/flowers/${item.id}`}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="favs-item-image"
                        />
                      </Link>
                      <div>
                        <h3 className="favs-item-name">{item.name}</h3>
                      </div>

                      <button
                        className="favs-clean"
                        onClick={() => dispatch(removeFromFavs(item.id))}>
                        X
                      </button>

                      {!inCart ? (
                        <button className="main__buy-button" onClick={() => handleAdd(item)}>
                          В корзину
                        </button>
                      ) : (
                        <button
                          className="main__buy-button remove"
                          onClick={() => handleRemove(item.id)}>
                          Удалить
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            <button className="favs-clear" onClick={() => dispatch(cleanFavs())}>
              Очистить избранное
            </button>
          </div>
        )}

        <div className="favs-add-more">
          <h2 className="favs-add-title">Добавьте цветы прямо отсюда:</h2>
          <Flowers />
        </div>
      </div>
    </div>
  );
}
