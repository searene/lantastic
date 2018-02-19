import * as React from 'react';
import {RootState} from "../reducers";
import {connect, Dispatch} from "react-redux";
import {bindActionCreators} from "redux";
import '../stylesheets/components/Title.scss'

interface TitleProps {
  className?: string;
  name: string;
}
interface TitleStates {

}
const mapStateToProps = (state: RootState) => ({
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
}, dispatch);

class ConnectedTitle extends React.Component<TitleProps, TitleStates> {
  render() {
    return (
      <div>
        <h3 className={this.props.className === undefined ? "area-title" : `${this.props.className + " area-title"}`}>{this.props.name}</h3>
        {this.props.children}
      </div>
    )
  }
}
export const Title = connect(mapStateToProps, mapDispatchToProps)(ConnectedTitle);
