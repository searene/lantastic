import * as React from 'react';
import {RootState} from "../reducers";
import {connect, Dispatch} from "react-redux";
import {bindActionCreators} from "redux";
import {ContentBlock, ContentState} from "draft-js";

const mapStateToProps = (state: RootState) => ({
});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
}, dispatch);
type ImageComponentProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & {
  block: ContentBlock;
  contentState: ContentState;
}

class ConnectedImageComponent extends React.Component<ImageComponentProps> {
  render() {
    console.log(this.props);
    const src = this.props.contentState.getEntity(this.props.block.getEntityAt(0)).getData().src;
    return (
      <figure>
        <img src={src}/>
      </figure>
    )
  }
}

export const ImageComponent = connect(mapStateToProps, mapDispatchToProps)(ConnectedImageComponent);
