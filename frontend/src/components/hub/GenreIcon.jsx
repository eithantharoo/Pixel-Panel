import {
  Compass,
  Drama,
  Flower2,
  Ghost,
  Heart,
  Landmark,
  Laugh,
  Rocket,
  Search,
  Siren,
  Sword,
  WandSparkles,
} from 'lucide-react';

const iconsByGenre = {
  romance: Heart,
  mystery: Search,
  comedy: Laugh,
  fantasy: WandSparkles,
  horror: Ghost,
  'sci-fi': Rocket,
  'slice-of-life': Flower2,
  historical: Landmark,
  adventure: Compass,
  drama: Drama,
  thriller: Siren,
};

export default function GenreIcon({ genreId, size = 16, className = '', strokeWidth = 2.2 }) {
  const Icon = iconsByGenre[genreId] || Sword;
  return <Icon size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" />;
}
