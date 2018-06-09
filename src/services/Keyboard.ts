import { List, Set, Stack } from "immutable";

export class Keyboard {
  public static KEY_CONTROL = "Control";
  public static KEY_ALT = "Alt";
  public static KEY_META = "Meta";
  public static KEY_SHIFT = "Shift";

  public static isModifierKeyPressed(keyStack: string[], modifierKeys: string[]): boolean {
    const modifierKeyStack = keyStack.filter(
      key => [this.KEY_CONTROL, this.KEY_ALT, this.KEY_META, this.KEY_SHIFT].indexOf(key) > -1
    );
    return Set(modifierKeyStack).equals(Set(modifierKeys));
  }
}
