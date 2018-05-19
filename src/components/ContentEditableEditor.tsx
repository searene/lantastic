import * as React from 'react';
import {RootState} from "../reducers";
import {connect, Dispatch, MapStateToProps} from "react-redux";
import {bindActionCreators} from "redux";
import {actions} from "../actions";
import '../stylesheets/components/RichEditor.scss';

interface ContentEditableEditorStates {

}

const mapStateToProps = (state: RootState) => ({
});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
}, dispatch);

export type ContentEditableEditorProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & {
  editorIndex: number;
}

export class RawContentEditableEditor extends React.Component<ContentEditableEditorProps, ContentEditableEditorStates> {
  private editor: HTMLDivElement;
  constructor(props: ContentEditableEditorProps) {
    super(props);
  }
  render() {
    return (
      <div
        style={{
          border: '1px solid rgba(34,36,38,.15)',
          padding: '.67857143em 1em',
          fontSize: '1em',
          marginBottom: '5px'
        }}
        contentEditable={true}
        ref={ (ref) => { this.editor = ref } }>

      </div>
    );
  }
  clear = () => {
    this.editor.innerHTML = '';
  };
  getContents = () => {
    return this.editor.innerHTML;
  };
}

export const ContentEditableEditor = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(RawContentEditableEditor);
