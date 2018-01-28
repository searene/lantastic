import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { actions } from '../actions/index'
import { Button, Icon, Checkbox, Menu, CheckboxProps } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { getType } from 'typesafe-actions';
import * as path from 'path';
import '../stylesheets/components/Scan.scss';
import { getPathToLantastic, createDirIfNotExists } from '../Utils';

declare var __IS_WEB__: boolean;

/** prevent from importing electron and other related stuff when we are building a web app
 *  http://ideasintosoftware.com/typescript-conditional-imports/ */
import * as Electron from 'electron';
import { dictParser as DictParser } from '../Parser';
let electron: typeof Electron;
let dictParser: typeof DictParser;
if(!__IS_WEB__) {
  electron = require('electron');
  dictParser = require('../Parser').dictParser;
}

export interface ScanProps {
  paths: string[]
  selectedPaths: string[]
  scanMessage: string
  addPaths: (paths: string[]) => any
  removeSelectedPaths: () => any
  addToSelectedPaths: (path: string) => any
  removeFromSelectedPaths: (path: string) => any
  setScanMessage: (message: string) => any
}
const mapStateToProps = (state: ScanProps) => ({
  paths: state.paths,
  selectedPaths: state.selectedPaths,
  scanMessage: state.scanMessage,
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  addPaths: (paths: string[]) => dispatch(actions.addPaths(paths)),
  removeSelectedPaths: () => dispatch(actions.removeSelectedPaths()),
  addToSelectedPaths: (path: string) => dispatch(actions.addToSelectedPaths(path)),
  removeFromSelectedPaths: (path: string) => dispatch(actions.removeFromSelectedPaths(path)),
  setScanMessage: (message: string) => dispatch(actions.setScanMessage(message)),
});

class ConnectedScan extends React.Component<ScanProps, {}> {

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
          <div className="scan-path-label">Scan Path:</div>
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
        <div style={{marginTop: '20px', paddingTop: '10px'}}>
          <div style={{display: 'inline-block'}}>
            <Button icon labelPosition='left' onClick={this.handleClickOnAdd}>
              <Icon name='add' />
              Add
            </Button>
            <Button icon labelPosition='left' onClick={this.handleClickOnRemove}>
              <Icon name='minus' />
              Remove
            </Button>
          </div>
          <div style={{float: 'right'}}>
            <span style={{marginRight: '10px'}}>{this.props.scanMessage}</span>
            <Button icon labelPosition='left' color="teal" onClick={this.handleClickOnScan.bind(this)}>
              <Icon name='search' />
              Scan
            </Button>
          </div>
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
  private async handleClickOnScan() {
    if(__IS_WEB__) {
      // fake scanning
      this.props.setScanMessage('Scan is completed');
    } else {
      this.props.setScanMessage('Start scanning...');
      dictParser.on('name', (dictionaryName: string) => {
        this.props.setScanMessage(`Scanning ${dictionaryName}...`);
      });
      await createDirIfNotExists(getPathToLantastic());
      let dictMap = await dictParser.scan(this.props.paths);
      this.props.setScanMessage('Scan is completed');
    }
  }
}
export const Scan = connect(mapStateToProps, mapDispatchToProps)(ConnectedScan);