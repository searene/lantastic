declare module "react-shortcuts" {
  class ShortcutManager {
    constructor(keymap?: any);

    public setKeymap(keymap: any): void;
  }

  interface IShortcutsProps {
    children: React.ReactNode;
    name: string;
    handler: (action: string, event: KeyboardEvent) => void;
    tabIndex?: number;
    className?: string;
    eventType?: "keyup" | "keydown" | "keypress";
    stopPropagation?: boolean;
    preventDefault?: boolean;
    targetNodeSelector?: string;
    global?: boolean;
    isolate?: boolean;
    alwaysFireHandler?: boolean;
    style?: React.CSSProperties;
  }

  // tslint:disable:max-classes-per-file
  class Shortcuts extends React.Component<IShortcutsProps> {

  }
}