import Toast from "react-native-toast-message";

enum ToasterEnum {
  success = 'Success',
  error = 'Error',
  info = 'Info',
}

export const toaster = (type: 'success' | 'error' | 'info', message: string) => {
  Toast.show({
    position: 'top',
    topOffset: 40,
    type,
    text1: ToasterEnum[type],
    text2: message
  });
}