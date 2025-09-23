import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const genres = [
  'Pop', 'Hip-Hop', 'R&B', 'Rock', 'Electronic', 'House',
  'Afrobeats', 'Latin', 'Indie', 'Classical', 'Jazz'
];

interface GenreFilterProps {
  selectedGenres: string[];
  onGenreToggle: (genre: string) => void;
}

export default function GenreFilter({ selectedGenres, onGenreToggle }: GenreFilterProps) {
  const { t } = useLanguage();

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center mb-6"
      >
        <h3 className="text-2xl font-bold text-foreground mb-2">
          {t('genre.select')}
        </h3>
      </motion.div>

      <div className="flex flex-wrap gap-3 justify-center">
        {genres.map((genre, index) => {
          const isSelected = selectedGenres.includes(genre);
          
          return (
            <motion.button
              key={genre}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              onClick={() => onGenreToggle(genre)}
              className={`genre-chip ${isSelected ? 'genre-chip-selected' : ''}`}
            >
              {genre}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}