import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import {
  EMPTY_KITE,
  hasProgress,
  heightLine,
  kiteLine,
  letOut,
  reelIn,
  resetKite,
  type KiteState,
} from "./src/kite";
import { loadKite, saveKite } from "./src/store";

export default function App() {
  const [state, setState] = useState<KiteState>(EMPTY_KITE);
  const [note, setNote] = useState("Look at the kite.");
  const [ready, setReady] = useState(false);
  const [confirmNew, setConfirmNew] = useState(false);

  useEffect(() => {
    let alive = true;
    loadKite()
      .then((loaded) => {
        if (!alive) return;
        setState(loaded);
        setNote(hasProgress(loaded) ? "Saved kite loaded." : "Look at the kite.");
        setReady(true);
      })
      .catch(() => {
        if (alive) setNote("Could not read the kite.");
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveKite(state).catch(() => setNote("Could not save the kite."));
  }, [ready, state]);

  if (!ready && note === "Look at the kite.") {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.loading}>Loading the kite</Text>
        </View>
      </SafeAreaView>
    );
  }

  function onOut() {
    const result = letOut(state);
    setState(result.state);
    setConfirmNew(false);
    setNote(result.note);
  }

  function onIn() {
    const result = reelIn(state);
    setState(result.state);
    setConfirmNew(false);
    setNote(result.note);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <Text style={styles.title}>Kite String</Text>
        <Text style={styles.note}>{note}</Text>
        <Text style={styles.count}>{heightLine(state)}</Text>
        <Text style={styles.line}>{kiteLine(state)}</Text>
        <BigButton label="Let it out" onPress={onOut} />
        <BigButton label="Reel it in" onPress={onIn} />
        {confirmNew ? (
          <View style={styles.row}>
            <BigButton label="Confirm new" filled inRow onPress={onConfirmNew} />
            <BigButton label="Cancel new" inRow onPress={onCancelNew} />
          </View>
        ) : (
          <BigButton label="New kite" onPress={() => setConfirmNew(true)} />
        )}
      </View>
    </SafeAreaView>
  );

  function onConfirmNew() {
    const result = resetKite();
    setState(result.state);
    setConfirmNew(false);
    setNote(result.note);
  }

  function onCancelNew() {
    setConfirmNew(false);
    setNote("New kite canceled.");
  }
}

function BigButton({
  label,
  onPress,
  filled,
  inRow,
}: {
  label: string;
  onPress: () => void;
  filled?: boolean;
  inRow?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.button, inRow && styles.buttonRow, filled && styles.buttonFilled]}
    >
      <Text style={[styles.buttonText, filled && styles.buttonTextFilled]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#E0F2FE" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  loading: { fontSize: 28, fontWeight: "800", color: "#0C4A6E" },
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 8, gap: 8 },
  title: { fontSize: 32, fontWeight: "800", color: "#0C4A6E" },
  note: { fontSize: 18, color: "#0369A1", minHeight: 24 },
  count: { fontSize: 22, fontWeight: "700", color: "#0C4A6E" },
  line: { fontSize: 36, fontWeight: "800", color: "#C2410C", lineHeight: 42 },
  row: { flexDirection: "row", gap: 8 },
  button: {
    minHeight: 64,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#0C4A6E",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    backgroundColor: "#FFFFFF",
  },
  buttonRow: { flex: 1 },
  buttonFilled: { backgroundColor: "#0C4A6E" },
  buttonText: { fontSize: 22, fontWeight: "800", color: "#0C4A6E", textAlign: "center" },
  buttonTextFilled: { color: "#FFFFFF" },
});
