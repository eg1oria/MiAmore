// 'use client';

// import { RootState } from '@/app/store';
// import { addToFav, removeFromFavs } from '@/features/cartSlice';
// import { IFlower } from '@/types/IFlower';
// import { FaHeart, FaRegHeart } from 'react-icons/fa';
// import { useDispatch, useSelector } from 'react-redux';

// interface CartButtonProps {
//   item: IFlower;
//   className?: string;
// }

// export default function FavsButton({ item, className }: CartButtonProps) {
//   const dispatch = useDispatch();
//   const favs = useSelector((state: RootState) => state.cart.favs);

//   const handleFavs = (flower: IFlower) => {
//     dispatch(addToFav(flower));
//   };

//   const handleRemoveFav = (id: number) => {
//     dispatch(removeFromFavs(id));
//   };

//   const inFavs = favs.some((f) => f.id === item.id);

//   return (
//     <div className="main__buttons">
//       {inFavs ? (
//         <button className={className} onClick={() => handleRemoveFav(item.id)}>
//           <FaHeart
//             style={{
//               color: 'red',
//             }}
//             size={27}
//           />
//         </button>
//       ) : (
//         <button className={className} onClick={() => handleFavs(item)}>
//           <FaRegHeart size={27} />
//         </button>
//       )}
//     </div>
//   );
// }
