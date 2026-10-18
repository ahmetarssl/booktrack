import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { readStorage, writeStorage } from '../utils/storage';

// State'i LocalStorage ile senkron tutan özel hook.
// İlk değer LocalStorage'dan okunur, state her değiştiğinde LocalStorage'a yazılır.
export function useLocalStorage<T>(
  key: string,
  deserialize: (raw: string | null) => T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => deserialize(readStorage(key)));

  useEffect(() => {
    writeStorage(key, value);
  }, [key, value]);

  return [value, setValue];
}
