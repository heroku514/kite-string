import AsyncStorage from "@react-native-async-storage/async-storage";
import { parseKite, type KiteState } from "./kite";

const KEY = "kite-string-v1";

export async function loadKite(): Promise<KiteState> {
  const raw = await AsyncStorage.getItem(KEY);
  return parseKite(raw);
}

export async function saveKite(state: KiteState): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(state));
}
