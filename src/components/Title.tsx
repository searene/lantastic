import * as React from "react";
import {connect, Dispatch} from "react-redux";
import {bindActionCreators} from "redux";
import {IRootState} from "../reducers";
import "../stylesheets/components/Title.scss";

interface TitleStates {

}
const mapStateToProps = (state: IRootState) => ({
});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
}, dispatch);

type TitleProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & {
  className?: string;
  name: string;
};

class ConnectedTitle extends React.Component<TitleProps, TitleStates> {
  public render() {
    return (
      <div>
        <h3 className={
          this.props.className === undefined ? "area-title" : `${this.props.className + " area-title"}`
        }>{this.props.name}</h3>
        {this.props.children}
      </div>
    );
  }
}
export const Title = connect(mapStateToProps, mapDispatchToProps)(ConnectedTitle);
