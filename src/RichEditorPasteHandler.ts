import {ContentState, EditorState, Modifier} from "draft-js";

export class RichEditorPasteHandler {
  getEditorStateFromHTML = (html: string): EditorState => {
    debugger;
    const dom = new DOMParser().parseFromString(html, 'text/html');
    const body = dom.getElementsByTagName('body')[0];
    const editorState = EditorState.createEmpty();
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      {url: 'https://www.google.com'}
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const contentStateWithLink = Modifier.applyEntity(
      contentStateWithEntity,
      selectionState,
      entityKey
    );
    return EditorState.push(editorState, contentStateWithLink, 'apply-entity');
  };
}