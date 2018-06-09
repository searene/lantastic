import { bindActionCreators } from "redux";

import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { RootState } from "../reducers";

const mapStateToProps = (state: RootState) => ({
  chosenDeckName: state.chosenDeckName
});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({}, dispatch);

type FooterProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

export class ConnectedFooter extends React.Component<FooterProps> {
  public render() {
    return (
      <footer
        style={{
          display: "flex",
          backgroundColor: "#F1F1F1",
          height: "30px",
          padding: "0 10px 0 10px",
          width: "100%",
          marginTop: "auto",
          alignItems: "center"
        }}
      >
        <div
          style={{
            marginRight: "15px"
          }}
        >
          <i className="book icon" />Deck: <b>{this.props.chosenDeckName}</b>
        </div>
      </footer>
    );
  }
}

export const Footer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedFooter);
