import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@apokalipsi_favorites';

export async function getFavorites(): Promise<number[]> {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function toggleFavorite(chapterId: number): Promise<boolean> {
  const favorites = await getFavorites();
  const index = favorites.indexOf(chapterId);
  if (index > -1) {
    favorites.splice(index, 1);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return false;
  } else {
    favorites.push(chapterId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return true;
  }
}

export async function isFavorite(chapterId: number): Promise<boolean> {
  const favorites = await getFavorites();
  return favorites.includes(chapterId);
}
