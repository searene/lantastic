import {CharacterMetadata, EditorState, ContentBlock} from "draft-js";
import {List, OrderedMap, OrderedSet} from "immutable";
import {range} from "./CommonUtils";

export const DRAFT_INLINE_STYLE_BOLD = 'BOLD';
export const DRAFT_INLINE_STYLE_ITALIC = 'ITALIC';
export const DRAFT_INLINE_STYLE_STRIKETHROUGH = 'STRIKETHROUGH';
export const DRAFT_INLINE_STYLE_CODE = 'CODE';
export const DRAFT_INLINE_STYLE_UNDERLINE = 'UNDERLINE';

export const getSelectedContentBlocksAsOrderedMap = (editorState: EditorState): OrderedMap<string, ContentBlock> => {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const startKey = selectionState.getStartKey();
  const endKey = selectionState.getEndKey();
  const blockMap = contentState.getBlockMap();
  return blockMap
    .toSeq()
    .skipUntil((_, k) => k === startKey)
    .takeUntil((_, k) => k === endKey)
    .concat([[endKey, blockMap.get(endKey)]])
    .toOrderedMap();
};

export const getSelectedContentBlocksAsList = (editorState: EditorState): List<ContentBlock> => {
  return getSelectedContentBlocksAsOrderedMap(editorState).toList();
};

export const getSelectedCharacterStyles = (editorState: EditorState): List<OrderedSet<string>> => {
  const startOffset = editorState.getSelection().getStartOffset();
  const endOffset = editorState.getSelection().getEndOffset();
  const selectedContentBlocks = getSelectedContentBlocksAsList(editorState);

  // we don't need to consider the situation when selectedContentBlocks.size === 0,
  // because it just wouldn't happen, there's still an empty ContentBlock when no text is selected.
  if(selectedContentBlocks.size === 1) {
    const contentBlock = selectedContentBlocks.get(0);
    return List(range(startOffset, endOffset))
      .map(offset => contentBlock.getInlineStyleAt(offset))
      .toList();
  } else {
    return selectedContentBlocks.flatMap((contentBlock, index) => {
      if(index === 0) {
        return List(range(startOffset, contentBlock.getCharacterList().size))
          .map(offset => contentBlock.getInlineStyleAt(offset))
          .toList();
      } else if(index === selectedContentBlocks.size - 1) {
        return List(range(0, endOffset))
          .map(offset => contentBlock.getInlineStyleAt(offset))
          .toList();
      } else {
        return List(range(0, contentBlock.getCharacterList().size))
          .map(offset => contentBlock.getInlineStyleAt(offset))
          .toList();
      }
    }).toList();
  }
};
export const isInSelection = (editorState: EditorState): boolean => {
  const selectionState = editorState.getSelection();
  return !selectionState.isCollapsed();
};
