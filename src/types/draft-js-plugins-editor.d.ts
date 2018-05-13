declare module "draft-js-plugins-editor" {

  import { EditorProps } from 'draft-js';
  import * as React from 'react';

  interface EditorWithPluginsProps extends EditorProps {
    plugins?: any[];
  }

  class Editor extends React.Component<EditorWithPluginsProps, {}> {
    // Force focus back onto the editor node.
    focus(): void;
    // Remove focus from the editor node.
    blur(): void;
  }
  export default Editor;
}
