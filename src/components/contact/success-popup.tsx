import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type SuccessPopupProps = {
  visible: boolean;
  message: string;
  onClose: () => void;
};

export function SuccessPopup({ visible, message, onClose }: SuccessPopupProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityRole="button">
        <Pressable style={styles.card} onPress={(event) => event.stopPropagation()}>
          <Text style={styles.message}>{message}</Text>
          <Pressable
            style={styles.button}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Text style={styles.buttonText}>OK</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(17, 24, 39, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 16,
    alignItems: "center",
  },
  message: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    lineHeight: 26,
  },
  button: {
    alignSelf: "stretch",
    backgroundColor: "#111827",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
