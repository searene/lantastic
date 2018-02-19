import * as React from 'react';
import {connect, Dispatch} from "react-redux";
import {RootState} from "../reducers";
import {bindActionCreators} from "redux";
import {actions} from "../actions";
import * as fse from 'fs-extra';
import {Segment} from 'semantic-ui-react';

interface TestComponentProps {
}

interface TestComponentStates {
}

// const mapStateToProps = (state: RootState) => ({
// });
// const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
// }, dispatch);


export class ConnectedTestComponent extends React.Component<TestComponentProps, TestComponentStates> {

  private segment: typeof Segment;

  render() {
    return (
      <Segment
        onClick={this.handleClick}
        ref={(ref: typeof Segment) => this.segment = ref}>
        test
      </Segment>
    );
  }
  private handleClick = () => {
    console.log('use segment');
    console.log(this.segment);
  };
}

// export const TestComponent = connect(mapStateToProps, mapDispatchToProps)(ConnectedTestComponent);