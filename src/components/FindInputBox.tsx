import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import { RootState } from "../reducers";
import { Icon, Input, Ref, SemanticICONS } from "semantic-ui-react";
import "../stylesheets/components/FindInputBox.scss";
import { actions } from "../actions";
import { MouseEventHandler } from "react";

const mapStateToProps = (state: RootState) => ({
  isFindInputBoxFocused: state.isFindInputBoxFocused,
});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  setFindInputBoxVisible: (isFindInputBoxVisible) =>
    dispatch(actions.setFindInputBoxVisible(isFindInputBoxVisible)),
  setFindInputBoxFocused: (isFindInputBoxFocused) =>
    dispatch(actions.setFindInputBoxFocused(isFindInputBoxFocused)),
}, dispatch);

type FindInputBoxProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & {
  [key: string]: any;
  style?: React.CSSProperties;
};

class InternalFindInputBox extends React.Component<FindInputBoxProps> {

  private input: HTMLInputElement;

  public componentDidMount() {
    this.input.addEventListener("keyup", (event) => {
      if (event.key === "Escape") {
        this.props.setFindInputBoxVisible(false);
      }
    });
    this.input.addEventListener("blur", (event) => {
      this.props.setFindInputBoxFocused(false);
    });
    this.input.addEventListener("focus", (event) => {
      this.props.setFindInputBoxFocused(true);
    });
    this.props.setFindInputBoxFocused(true);
  }
  public componentDidUpdate() {
    if (this.props.isFindInputBoxFocused) {
      this.input.focus();
      this.input.select();
    }
  }
  public render() {
    return (
      <div style={{
        position: "absolute",
        zIndex: 999,
        display: "flex",
        top: 0,
        width: "216px",
        left: "calc(50% - 108px)",
        border: "1px solid rgba(34,36,38,.15)",
        padding: "9.5px 14px",
      }}>
        <Ref innerRef={(ref) => this.input = ref.childNodes[0] as HTMLInputElement}>
          <Input
            className={"find-input"}
            focus={true}
            style={{
              width: "100px",
              borderRight: "1px solid rgba(34,36,38,.15)",
              marginRight: "10px",
            }}/>
        </Ref>
        { this.inputIcon("chevron up", this.handleClickOnPrevFind) }
        { this.inputIcon("chevron down", this.handleClickOnNextFind) }
        { this.inputIcon("close", this.handleClickOnClose) }
      </div>
    );
  }
  private inputIcon = (iconName: SemanticICONS, handler: MouseEventHandler<HTMLDivElement>): React.ReactNode => {
    return (
      <div className={"find-input-icon-container"}
           style={{
             marginRight: "10px",
           }}
           onClick={handler}>
        <Icon name={iconName}/>
      </div>
    );
  }
  private handleClickOnPrevFind = () => {

  }
  private handleClickOnNextFind = () => {

  }
  private handleClickOnClose = () => {
    this.props.setFindInputBoxVisible(false);
  }
}

export const FindInputBox = connect(mapStateToProps, mapDispatchToProps)(InternalFindInputBox);
