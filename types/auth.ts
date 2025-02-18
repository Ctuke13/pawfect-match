export interface User {
    name: string;
    email: string;
    zipcode?: string;
    favorites?: string[];
  }
  
  export interface AuthContextType {
    user: User | null;
    login: (name: string, email: string, zipcode?: string) => Promise<void>;
    logout: () => Promise<void>;
    updateFavorites: (favorites: string[]) => Promise<void>;
    updateZipcode: (zipcode: string) => void;
  }