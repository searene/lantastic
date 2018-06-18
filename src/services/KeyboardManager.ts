import { Set } from "immutable";
import { getOS, OS } from "../Utils/CommonUtils";

export class KeyboardManager {
  public static KEY_CONTROL = "Control";
  public static KEY_ALT = "Alt";
  public static KEY_META = "Meta";
  public static KEY_SHIFT = "Shift";

  public static isModifierKeyPressed = (modifierKeys: string[]): boolean => {
    const modifierKeyStack = KeyboardManager.pressedKeyStack.filter(
      key =>
        [
          KeyboardManager.KEY_CONTROL,
          KeyboardManager.KEY_ALT,
          KeyboardManager.KEY_META,
          KeyboardManager.KEY_SHIFT
        ].indexOf(key) > -1
    );
    return Set(modifierKeyStack).equals(Set(modifierKeys));
  };

  public static isKeyPressed = (modifierKeys: string[], normalKey: string): boolean => {
    return (
      KeyboardManager.isModifierKeyPressed(modifierKeys) &&
      KeyboardManager.pressedKeyStack[KeyboardManager.pressedKeyStack.length - 1] === normalKey
    );
  };

  public static isKeyWithCtrlOrCmdPressed = (otherModifierKeys: string[], normalKey: string): boolean => {
    const isMacShortcut =
      getOS() === OS.MacOS && KeyboardManager.isKeyPressed([KeyboardManager.KEY_META, ...otherModifierKeys], normalKey);
    const isWinOrLinuxShortcut =
      [OS.MacOS, OS.Linux].indexOf(getOS()) > -1 &&
      KeyboardManager.isKeyPressed([KeyboardManager.KEY_CONTROL, ...otherModifierKeys], normalKey);
    return isMacShortcut || isWinOrLinuxShortcut;
  };
  public static registerEventListeners = () => {
    if (!KeyboardManager.isKeyboardEventListenerRegistered) {
      document.addEventListener("keydown", event => {
        KeyboardManager.pressedKeyStack.push(event.key);
      });
      document.addEventListener("keyup", event => {
        KeyboardManager.pressedKeyStack.pop();
      });
      KeyboardManager.isKeyboardEventListenerRegistered = true;
    }
  };
  private static pressedKeyStack: string[] = [];
  private static isKeyboardEventListenerRegistered = false;
}
