import {bindActionCreators} from "redux";

import * as React from 'react';
import {connect, Dispatch} from "react-redux";

interface FooterStates {

}
interface FooterProps {
  chosenDeckName: string;
}
const mapStateToProps = (state: FooterProps) => ({
  chosenDeckName: state.chosenDeckName,
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
}, dispatch);

export class ConnectedFooter extends React.Component<FooterProps, FooterStates> {

  render() {
    const styles: React.CSSProperties = {
      container: {
        display: "flex",
        backgroundColor: "#F1F1F1",
        height: "30px",
        padding: "0 10px 0 10px",
        width: "100%",
        marginTop: "auto",
        alignItems: "center",
      },
      iconContainer: {
        marginRight: "15px",
      },
    };
    return (
      <footer style={styles.container}>
        <div style={styles.iconContainer}><i className="book icon"></i>Deck: <b>{this.props.chosenDeckName}</b></div>
      </footer>
    );
  }
}

export const Footer = connect(mapStateToProps, mapDispatchToProps)(ConnectedFooter);
