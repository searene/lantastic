import * as React from 'react';
import * as ReactDOM from 'react-dom';

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

    const styles: React.CSSProperties = {
      container: {
        height: "100%",
      },
      pathContainer: {
        display: "flex",
        justifyContent: 'space-between',
      },
      scanPaths: {
        height: "100%",
      },
      bottom: {
        marginTop: "20px",
        paddingTop: "10px",
      },
      span: {
         marginBottom: "10px",
      },
      paths: {
      },
      add: {
        float: "left",
      },
      remove: {
        float: "left",
      },
      scan: {
        float: "right",
      },
    }

    const paths = this.props.paths.map((path, i) => {
      return (
          <a className="item path" key={path} style={styles.pathContainer}>
            {path}
            <div className="ui fitted checkbox">
              <input type="checkbox" />
              <label></label>
            </div>
          </a>
      )
    });

    return (
      <div style={styles.container}>
        <div style={styles.scanPaths}>
          <div style={styles.span}>Scan Path:</div>
          <div className="ui fluid vertical menu" style={styles.paths}>
            {paths}
          </div>
        </div>
        <div style={styles.bottom}>
          <button className="ui right labeled icon button" style={styles.add}>
            <i className="add icon"></i>
            Add
          </button>
          <button className="ui right labeled icon button" style={styles.remove}>
            <i className="minus icon"></i>
            Remove
          </button>
          <button className="ui teal right labeled icon button" style={styles.scan}>
            <i className="search icon"></i>
            Scan
          </button>
        </div>
      </div>


    )
  }
}