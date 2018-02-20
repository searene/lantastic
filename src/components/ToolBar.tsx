import * as React from 'react';
import {connect, Dispatch} from "react-redux";
import {RootState} from "../reducers";
import {bindActionCreators} from "redux";
import {actions} from "../actions";
import {Icon, Menu} from 'semantic-ui-react';
import {EditorState} from 'draft-js';
import '../stylesheets/components/ToolBar.scss'

interface ToolBarProps {
  editorState: EditorState
}

interface ToolBarStates {
}

const mapStateToProps = (state: RootState) => ({
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
}, dispatch);


export class ConnectedToolBar extends React.Component<ToolBarProps, ToolBarStates> {

  constructor(props: ToolBarProps) {
    super(props);
  }

  render() {
    return (
      <Menu icon>
        <Menu.Item name='bold'>
          <Icon name='gamepad' />
        </Menu.Item>

        <Menu.Item name='italic'>
          <Icon name='video camera' />
        </Menu.Item>

        <Menu.Item name='underline'>
          <Icon name='video play' />
        </Menu.Item>
      </Menu>
    );
  }
}

export const ToolBar = connect(mapStateToProps, mapDispatchToProps)(ConnectedToolBar);

