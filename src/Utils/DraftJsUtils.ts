import {CharacterMetadata, EditorState, ContentBlock} from "draft-js";
import {List, OrderedMap, OrderedSet} from "immutable";
import {range} from "./CommonUtils";

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
  if(selectedContentBlocks.size === 0) {
    throw new Error("No selection.");
  } else if(selectedContentBlocks.size === 1) {
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