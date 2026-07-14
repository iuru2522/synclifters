import { Modal, Pressable, Text } from "react-native";
import { globalStyles } from "@/styles/global";

type SuccessPopupProps = {
  visible: boolean;
  message: string;
  onClose: () => void;
};

export function SuccessPopup({ visible, message, onClose }: SuccessPopupProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={globalStyles.modalBackdrop} onPress={onClose} accessibilityRole="button">
        <Pressable style={globalStyles.modalCard} onPress={(event) => event.stopPropagation()}>
          <Text style={globalStyles.modalMessage}>{message}</Text>
          <Pressable
            style={globalStyles.modalButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Text style={globalStyles.modalButtonText}>OK</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
