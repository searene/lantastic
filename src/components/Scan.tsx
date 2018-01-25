import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { actions } from '../actions/index'
import { Button, Icon, Checkbox, Menu, CheckboxProps } from 'semantic-ui-react';
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
  paths: string[]
  selectedPaths: string[]
  addPaths: (paths: string[]) => any
  removeSelectedPaths: () => any
  addToSelectedPaths: (path: string) => any
  removeFromSelectedPaths: (path: string) => any
}
export interface ScanStates {
  selectedPaths: string[]
  message: string
}
const mapStateToProps = (state: ScanProps) => ({
  paths: state.paths,
  selectedPaths: state.selectedPaths
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  addPaths: (paths: string[]) => dispatch(actions.addPaths(paths)),
  removeSelectedPaths: () => dispatch(actions.removeSelectedPaths()),
  addToSelectedPaths: (path: string) => dispatch(actions.addToSelectedPaths(path)),
  removeFromSelectedPaths: (path: string) => dispatch(actions.removeFromSelectedPaths(path)),
});

class ConnectedScan extends React.Component<ScanProps, ScanStates> {

  constructor(props: ScanProps) {
    super(props);
    this.state = {
      selectedPaths: [],
      message: ''
    }
  }

  componentDidMount() {
    // const onclick: EventListener = function(this: HTMLElement) {}
  }

  private selectedPaths: string[] = [];

  render() {
    return (
      <div className="scan-container">
        <div className="scan-path">
          <div className="scan-path-label">Scan Path: {this.state.message}</div>
          <Menu vertical>
            {this.props.paths.map(path =>
              <label key={path}>
                <Menu.Item className="path">
                  {path}
                  <Checkbox
                    checked={this.props.selectedPaths.indexOf(path) > -1}
                    onChange={(event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {this.changeSelectedPath(path, data.checked)}} />
                </Menu.Item>
              </label>
            )}
          </Menu>
        </div>
        <div className="bottom-div">
          <Button icon labelPosition='left' onClick={this.handleClickOnAdd}>
            <Icon name='add' />
            Add
          </Button>
          <Button icon labelPosition='left' onClick={this.handleClickOnRemove}>
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
  private handleClickOnRemove = () => {
    this.props.removeSelectedPaths();
  }
  private changeSelectedPath = (path: string, isAdded: boolean) => {
    if(isAdded) {
      this.props.addToSelectedPaths(path);
    } else {
      this.props.removeFromSelectedPaths(path);
    }
  }
}
export const Scan = connect(mapStateToProps, mapDispatchToProps)(ConnectedScan);