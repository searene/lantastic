import * as React from 'react';
import * as Radium from 'radium';
import { Dictionary } from './Dictionary';

export interface NavbarState {
  activatedItem: undefined | "dictionary";
  width: string;
}

@Radium
export class Navbar extends React.Component<undefined, NavbarState> {
  constructor() {
    super();
    this.state = {
      activatedItem: "dictionary",
      width: "50%",
    }
  }
  render() {
    const navbarWidth = "50px";
    const styles: React.CSSProperties = {
      ul: {
        width: navbarWidth,
        height: "100%",
        listStyleType: "none",
        paddingLeft: 0,
        marginTop: 0,
        marginBottom: 0,
        backgroundColor: "black",
      },
      li: {
        position: "relative",
        textAlign: "center",
        marginTop: "10px",
        marginBottom: "20px",
        color: "gray",
        cursor: "pointer",
      },
      a: {
        color: "grey",
        ':hover': {
          color: "white",
        },
      },
      container: {
        display: "flex",
      },
      component: {
        paddingLeft: "0.5em",
        paddingRight: "0.5em",
        width: `calc(100% - ${navbarWidth})`,
        height: "100%",
        backgroundColor: "#F8F5EC",
      },
    };

    let component: JSX.Element;
    if (this.state.activatedItem == 'dictionary') {
      component = <Dictionary />
    }
    return (
      <div style={styles.container} id="navbar">
        <ul style={styles.ul}>
          <li style={styles.li}><a style={styles.a} key="dictionary"><i className="big search icon"></i></a></li>
          <li style={styles.li}><a style={styles.a} key="type"><i className="big tasks icon"></i></a></li>
          <li style={styles.li}><a style={styles.a} key="deck"><i className="big book icon"></i></a></li>
        </ul>
        <div style={styles.component}>
          {component != undefined && component}
        </div>
      </div>
    );
  }
}