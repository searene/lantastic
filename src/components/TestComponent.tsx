import * as React from 'react';
import {connect, Dispatch} from "react-redux";
import {RootState} from "../reducers";
import {bindActionCreators} from "redux";
import {actions} from "../actions";
import * as fse from 'fs-extra';

interface TestComponentProps {
}

interface TestComponentStates {
  isLoaded: boolean;
  anotherIsLoaded: boolean;
}

const mapStateToProps = (state: RootState) => ({
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
}, dispatch);


class ConnectedTestComponent extends React.Component<TestComponentProps, TestComponentStates> {

  constructor(props: TestComponentProps) {
    super(props);
    this.state = {
      isLoaded: false,
      anotherIsLoaded: false
    };
  }
  async componentWillMount() {
    debugger;
    console.log('will mount');
    this.setState({
      isLoaded: await fse.pathExists("/"),
      anotherIsLoaded: await fse.pathExists("/home"),
    });
  }

  async componentWillUpdate() {
    debugger;
    console.log('will update');
  }

  async componentDidMount() {
    debugger;
  }

  async componentDidUpdate() {
    debugger;
  }

  render() {
    debugger;
    return (
      <div>test</div>
    );
  }
}

export const TestComponent = connect(mapStateToProps, mapDispatchToProps)(ConnectedTestComponent);
