import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const shopIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapComponent() {
  const shopPosition: [number, number] = [43.2389, 76.8897];
  const shopPosition1: [number, number] = [43.2567, 76.9286];
  const shopPosition2: [number, number] = [43.2167, 76.8786];
  const shopPosition3: [number, number] = [43.2647, 76.9186];

  const allPositions = [shopPosition, shopPosition1, shopPosition2, shopPosition3];
  const centerPosition: [number, number] = [
    allPositions.reduce((sum, pos) => sum + pos[0], 0) / allPositions.length,
    allPositions.reduce((sum, pos) => sum + pos[1], 0) / allPositions.length,
  ];

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer
        center={centerPosition}
        zoom={12}
        className="MapContainer"
        style={{ height: '100%', width: '100%', zIndex: 1 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={shopPosition} icon={shopIcon}>
          <Popup>
            <strong>Главный магазин</strong>
            <br />
            Сейфуллина 67а, Алматы
          </Popup>
        </Marker>

        <Marker position={shopPosition1} icon={shopIcon}>
          <Popup>
            <strong>Филиал №1</strong>
            <br />
            Восточный район, Алматы
          </Popup>
        </Marker>

        <Marker position={shopPosition2} icon={shopIcon}>
          <Popup>
            <strong>Филиал №2</strong>
            <br />
            Западный район, Алматы
          </Popup>
        </Marker>

        <Marker position={shopPosition3} icon={shopIcon}>
          <Popup>
            <strong>Филиал №3</strong>
            <br />
            Северный район, Алматы
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
