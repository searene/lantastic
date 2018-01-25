import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { actions } from '../actions/index'
import { Button, Icon, Checkbox, Menu } from 'semantic-ui-react';
import { AnyAction, Dispatch } from 'redux';
import { getType } from 'typesafe-actions';
import * as path from 'path';
import '../stylesheets/components/Scan.scss';

declare var __IS_WEB__: boolean;

/** prevent from importing electron when we are building a web app
 *  http://ideasintosoftware.com/typescript-conditional-imports/ */
import * as Electron from 'electron';
let electron: typeof Electron;
if(!__IS_WEB__) {
  electron = require('electron');
}

export interface ScanProps {
  paths: string[],
  addPaths: (paths: string[]) => any
}
export interface ScanStates {
  message: string,
}
const mapStateToProps = (state: ScanProps) => {
  return {
    paths: state.paths,
  }
};
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  addPaths: (paths: string[]) => dispatch(actions.addPaths(paths))
});

class ConnectedScan extends React.Component<ScanProps, ScanStates> {

  constructor(props: ScanProps) {
    super(props);
    this.state = {
      message: ''
    }
  }

  componentDidMount() {
    // const onclick: EventListener = function(this: HTMLElement) {}
  }

  render() {
    return (
      <div className="scan-container">
        <div className="scan-path">
          <div className="scan-path-label">Scan Path: {this.state.message}</div>
          <Menu vertical>
            {this.props.paths.map(path =>
              <label key={path}><Menu.Item className="path">{path}<Checkbox /></Menu.Item></label>
            )}
          </Menu>
        </div>
        <div className="bottom-div">
          <Button icon labelPosition='left' onClick={this.handleClickOnAdd}>
            <Icon name='add' />
            Add
          </Button>
          <Button icon labelPosition='left'>
            <Icon name='minus' />
            Remove
          </Button>
          <Button icon labelPosition='left' color="teal" className="scan-button">
            <Icon name='search' />
            Scan
          </Button>
        </div>
      </div>
    )
  }
  private handleClickOnAdd = () => {
    let addedPaths: string[];
    if(!__IS_WEB__) {
      electron.remote.dialog.showOpenDialog({
        properties: ['openDirectory']
      }, filePaths => {
        addedPaths = filePaths;
      });
    } else {
      // just for testing
      addedPaths = ['/home/searene'];
    }
    let addedPathsAfterRemovingDuplicates = this.removeDuplicates(addedPaths, this.props.paths);
    this.props.addPaths(addedPathsAfterRemovingDuplicates);
  }
  private removeDuplicates = (addedPaths: string[], previousPaths: string[]) => {
    let duplicateIndex: number[] = [];
    for(let i = 0; i < addedPaths.length; i++) {
      for(let previousPath of previousPaths) {
        if(path.normalize(addedPaths[i]) === path.normalize(previousPath)) {
          // found a duplicate
          duplicateIndex.push(i);
        }
      }
    }
    let finalAddedPaths: string[] = [];
    for(let i = 0; i < addedPaths.length; i++) {
      if(duplicateIndex.indexOf(i) === -1) {
        finalAddedPaths.push(addedPaths[i]);
      }
    }
    return finalAddedPaths;
  }
}
export const Scan = connect(mapStateToProps, mapDispatchToProps)(ConnectedScan);