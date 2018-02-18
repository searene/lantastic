/** prevent from importing electron and other related stuff when we are building a web app
 *  http://ideasintosoftware.com/typescript-conditional-imports/ */
import {ZipEntry} from "../js/node-stream-zip";

declare var __IS_WEB__: boolean;
import * as Electron from 'electron';
import { dictParser as DictParser } from '../Parser';
import {ZipReader as ZipReaderType} from "../ZipReader";
import * as Fse from 'fs-extra';
let electron: typeof Electron;
let dictParser: typeof DictParser;
let fse: typeof Fse;
let ZipReader: typeof ZipReaderType;
if(!__IS_WEB__) {
  electron = require('electron');
  dictParser = require('../Parser').dictParser;
  fse = require('fs-extra');
  ZipReader = require('../ZipReader').ZipReader;
}

import * as React from 'react';
import { connect } from 'react-redux';
import {DictMap} from "dict-parser/lib/DictionaryFinder";
import { actions } from '../actions';
import { Button, Icon, Checkbox, Menu, CheckboxProps } from 'semantic-ui-react';
import {bindActionCreators, Dispatch} from 'redux';
import * as path from 'path';
import '../stylesheets/components/Scan.scss';
import { getPathToLantastic, createDirIfNotExists } from '../Utils';
import {RootState} from "../reducers";


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
const mapStateToProps = (state: RootState) => ({
  paths: state.paths,
  selectedPaths: state.selectedPaths,
  scanMessage: state.scanMessage,
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  addPaths: actions.addPaths,
  removeSelectedPaths: actions.removeFromSelectedPaths,
  addToSelectedPaths: actions.addToSelectedPaths,
  removeFromSelectedPaths: actions.removeFromSelectedPaths,
  setScanMessage: actions.setScanMessage,
}, dispatch);

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
          <div className="scan-top">
            <div className="scan-path-label">Scan Path:</div>
            <Menu vertical className="scan-item">
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
          <div style={{marginTop: '20px', paddingTop: '10px', width: '100%'}}>
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
      </div>
    )
  }
  private handleClickOnAdd = () => {
    if(!__IS_WEB__) {
      electron.remote.dialog.showOpenDialog({
        properties: ['openDirectory']
      }, filePaths => {
        let addedPathsAfterRemovingDuplicates = this.removeDuplicates(filePaths, this.props.paths);
        this.props.addPaths(addedPathsAfterRemovingDuplicates);
      });
    } else {
      // just for testing
      const filePaths = ['/home/searene'];
      let addedPathsAfterRemovingDuplicates = this.removeDuplicates(filePaths, this.props.paths);
      this.props.addPaths(addedPathsAfterRemovingDuplicates);
    }
  };
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
  };
  private handleClickOnRemove = () => {
    this.props.removeSelectedPaths();
  };
  private changeSelectedPath = (path: string, isAdded: boolean) => {
    if(isAdded) {
      this.props.addToSelectedPaths(path);
    } else {
      this.props.removeFromSelectedPaths(path);
    }
  };
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
      const dictMapList = await dictParser.scan(this.props.paths);

      // build zip entries for each zip file
      const resourceHolderList = await this.getZippedResourceHolders(dictMapList);
      for(const resourceHolder of resourceHolderList) {
        this.props.setScanMessage(`Building entries for ${path.basename(resourceHolder)}...`);
        await this.buildZipEntries(resourceHolder);
        console.log(`entries are built successfully`);
      }

      console.log(`scan is completed`);
      this.props.setScanMessage('Scan is completed');
    }
  }
  private buildZipEntries = async (resourceHolder: string): Promise<void> => {
    const entries = await ZipReader.getZipEntries(resourceHolder);
    await ZipReader.saveEntriesToDb(resourceHolder, entries);
  };
  private getZippedResourceHolders = async (dictMapList: DictMap[]): Promise<string[]> => {
    const resourceHolderList = [];
    for(const dictMap of dictMapList) {
      const resourceHolder = dictMap.dict.resourceHolder;
      if((await fse.stat(resourceHolder)).isFile() && resourceHolder.endsWith('.zip')) {
        resourceHolderList.push(resourceHolder);
      }
    }
    return resourceHolderList;
  }
}
export const Scan = connect(mapStateToProps, mapDispatchToProps)(ConnectedScan);