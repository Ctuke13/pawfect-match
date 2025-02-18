export interface FavoritesContextType {
    favorites: string[];
    addFavorite: (dogId: string) => void;
    removeFavorite: (dogId: string) => void;
    isFavorite: (dogId: string) => boolean;
    clearFavorites: () => void;
  }