import * as electron from "electron";
import * as fse from "fs-extra";
import * as path from "path";
import * as React from "react";
import { Button, Icon, Table } from "semantic-ui-react";
import { Configuration } from "../Configuration";
import { Parser } from "../Parser";
import "../stylesheets/components/Scan.scss";
import { createDirIfNotExists, getPathToLantastic } from "../Utils/CommonUtils";
import { ZipReader } from "../ZipReader";
import { BaseButton } from "./BaseButton";
import { Title } from "./Title";

interface IScanStates {
  scanPaths: string[];
  scanMessage: string;
}

export class Scan extends React.Component<{}, IScanStates> {
  constructor(props: {}) {
    super(props);
    this.state = {
      scanPaths: Configuration.get(Configuration.SCAN_PATHS_KEY),
      scanMessage: ""
    };
  }

  public render() {
    return (
      <div className="scan-container">
        <div className="scan-path">
          <div className="scan-top">
            <Title name={"Scan Paths"}>{this.getTable()}</Title>
          </div>
          <div style={{ marginTop: "20px", paddingTop: "10px", width: "100%" }}>
            <div style={{ display: "inline-block" }}>
              <Button icon={true} labelPosition="left" onClick={this.handleClickOnAdd}>
                <Icon name="add" />
                Add
              </Button>
            </div>
            <div style={{ float: "right" }}>
              <span style={{ marginRight: "10px" }}>{this.state.scanMessage}</span>
              <Button icon={true} labelPosition="left" color="teal" onClick={this.handleClickOnScan.bind(this)}>
                <Icon name="search" />
                Scan
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private getTable = () => (
    <Table celled={true}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Path</Table.HeaderCell>
          <Table.HeaderCell>Actions</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {this.state.scanPaths.map(scanPath => (
          <Table.Row key={scanPath}>
            <Table.Cell>{scanPath}</Table.Cell>
            <Table.Cell collapsing={true}>
              <BaseButton color={"red"} size={"tiny"} onClick={this.handleClickOnRemove}>
                Remove
              </BaseButton>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );

  private handleClickOnAdd = () => {
    electron.remote.dialog.showOpenDialog(
      {
        properties: ["openDirectory"]
      },
      async filePaths => {
        const uniquePaths = this.removeDuplicates(filePaths, this.state.scanPaths);
        await Configuration.insertOrUpdate(Configuration.SCAN_PATHS_KEY, uniquePaths);
        this.setState({
          scanPaths: uniquePaths
        });
      }
    );
  };
  private removeDuplicates = (addedPaths: string[], previousPaths: string[]) => {
    const normalizedPaths = addedPaths.concat(previousPaths).map(p => path.normalize(p));
    return normalizedPaths.removeDuplicates();
  };
  private handleClickOnRemove = async (event: React.SyntheticEvent<HTMLButtonElement>) => {
    const target = event.target as HTMLButtonElement;
    const scanPath = (target.parentElement.previousElementSibling as HTMLTableDataCellElement).innerHTML;
    const newPaths = Configuration.get(Configuration.SCAN_PATHS_KEY)
      .concat()
      .remove(scanPath);
    await Configuration.insertOrUpdate(Configuration.SCAN_PATHS_KEY, newPaths);
    this.setState({
      scanPaths: newPaths
    });
  };

  private async handleClickOnScan() {
    Parser.getDictParser().on("name", (dictionaryName: string) => {
      this.setState({
        scanMessage: `Scanning ${dictionaryName}`
      });
    });
    await createDirIfNotExists(getPathToLantastic());
    const dictMapList = await Parser.getDictParser().scan(this.state.scanPaths);

    // build zip entries for each zip file
    // const resourceHolderList = await this.getZippedResourceHolders(dictMapList);
    // for (const resourceHolder of resourceHolderList) {
    //   this.setState({
    //     scanMessage: `Building entries for ${path.basename(resourceHolder)}...`
    //   });
    //   await this.buildZipEntries(resourceHolder);
    // }

    this.setState({
      scanMessage: `Scan is completed`
    });
  }

  private buildZipEntries = async (resourceHolder: string): Promise<void> => {
    const entries = await ZipReader.getZipEntries(resourceHolder);
    await ZipReader.saveEntriesToDb(resourceHolder, entries);
  };
  // private getZippedResourceHolders = async (dictMapList: DictMap[]): Promise<string[]> => {
  //   const resourceHolderList = [];
  //   for (const dictMap of dictMapList) {
  //     const resourceHolder = dictMap.dict.resourceHolder;
  //     if ((await fse.stat(resourceHolder)).isFile() && resourceHolder.endsWith(".zip")) {
  //       resourceHolderList.push(resourceHolder);
  //     }
  //   }
  //   return resourceHolderList;
  // };
}

