import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button, Icon, Checkbox, Menu } from 'semantic-ui-react';

// uncomment to make electron work
// import * as electron from 'electron';

import '../stylesheets/components/Scan.scss';

export interface ScanProps {
  paths: string[]
}

export class Scan extends React.Component<ScanProps, undefined> {

  componentDidMount() {
    const paths = document.getElementsByClassName('path');
    const onclick: EventListener = function(this: HTMLElement) {

    }
    for(let i = 0; i < paths.length; i++) {
      paths[i].addEventListener('click', function(this: HTMLElement) {
        this.classList.toggle('active');
        for(let j = 0; j < this.children.length; j++) {
          if(this.children[j].classList.contains('checkbox')) {
            const child = this.children[j];
            child.classList.toggle('checked');
            for(let k = 0; k < child.children.length; k++) {
              if(child.children[k].getAttribute('type') == 'checkbox') {
                (child.children[k] as HTMLInputElement).checked = !(child.children[k] as HTMLInputElement).checked
                break;
              }
            }
            break;
          }
        }
      });
    }
  }

  render() {
    return (
      <div className="scan-container">
        <div className="scan-path">
          <div className="scan-path-label">Scan Path:</div>
          <Menu vertical>
            {this.props.paths.map(path => <Menu.Item className='path' key={path}>{path}<Checkbox /></Menu.Item>)}
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
    // uncomment to make electron work
    // TODO add random string to this.props.paths using redux as a test

    // electron.remote.dialog.showOpenDialog({
    //   properties: ['openDirectory']
    // }, filePaths => {
    //   // TODO add filePaths to this.props.paths
    // });
  }
}