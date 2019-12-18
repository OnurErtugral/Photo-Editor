import React, { Component } from "react";
import { connect } from "react-redux";
import { DragSource } from "react-dnd";

import "./cropElement.css";

const cardSource = {
    canDrag(props) {
        return !props.flag;
    },
    isDragging(props, monitor) {
        return monitor.getItem().id === props.id;
    },

    beginDrag(props, monitor, component) {
        const item = { id: props.id, left: props.left, top: props.top };
        return item;
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

class CropElement extends Component {
    constructor(props) {
        super(props);
        this.overlappingDiv = React.createRef();
        this.state = {
            clickedResizeRegion: false,
            cursor: null
        };
    }

    handleMouseDown = e => {
        let mouseXInCropElement = e.nativeEvent.offsetX;
        let mouseYInCropElement = e.nativeEvent.offsetY;

        if (mouseXInCropElement < 10 && mouseYInCropElement < 10) {
            console.log("LT");
            this.props.setCropDivClickedResizeRegion("LT");
            this.props.setCropDivInitialCoor(
                mouseXInCropElement,
                mouseYInCropElement
            );
        } else if (
            this.props.cropDivWidth - mouseXInCropElement < 10 &&
            mouseYInCropElement < 10
        ) {
            console.log("RT");
            this.props.setCropDivClickedResizeRegion("RT");
            this.props.setCropDivInitialCoor(
                mouseXInCropElement,
                mouseYInCropElement
            );
        } else if (
            this.props.cropDivWidth - mouseXInCropElement < 10 &&
            this.props.cropDivHeight - mouseYInCropElement < 10
        ) {
            console.log("RB");
            this.props.setCropDivClickedResizeRegion("RB");
            this.props.setCropDivInitialCoor(
                mouseXInCropElement,
                mouseYInCropElement
            );
        } else if (
            mouseXInCropElement < 10 &&
            this.props.cropDivHeight - mouseYInCropElement < 10
        ) {
            console.log("LB");
            this.props.setCropDivClickedResizeRegion("LB");
            this.props.setCropDivInitialCoor(
                mouseXInCropElement,
                mouseYInCropElement
            );
        }
    };

    handleMouseUp = e => {
        let mouseXInCropElement = e.nativeEvent.offsetX;
        let mouseYInCropElement = e.nativeEvent.offsetY;

        let diffX = mouseXInCropElement - this.props.cropDivClickInitialX;
        let diffY = mouseYInCropElement - this.props.cropDivClickInitialY;

        if (this.props.cropDivClickedResizeRegion === "RB") {
            this.props.setCropDivSize("RB", diffX, diffY);
        } else if (this.props.cropDivClickedResizeRegion === "RT") {
            this.props.setCropDivLeftAndTop(diffY, 0);
            this.props.setCropDivSize("RT", diffX, -diffY);
        } else if (this.props.cropDivClickedResizeRegion === "LT") {
            this.props.setCropDivLeftAndTop(diffY, diffX);
            this.props.setCropDivSize("LT", -diffX, -diffY);
        } else if (this.props.cropDivClickedResizeRegion === "LB") {
            this.props.setCropDivLeftAndTop(0, diffX);
            this.props.setCropDivSize("LT", -diffX, diffY);
        }
    };

    handleMouseMove = e => {
        let mouseXInCropElement = e.nativeEvent.offsetX;
        let mouseYInCropElement = e.nativeEvent.offsetY;
        if (mouseXInCropElement < 10 && mouseYInCropElement < 10) {
            this.setState({ cursor: "se-resize" });
        } else if (
            this.props.cropDivWidth - mouseXInCropElement < 10 &&
            mouseYInCropElement < 10
        ) {
            this.setState({ cursor: "ne-resize" });
        } else if (
            this.props.cropDivWidth - mouseXInCropElement < 10 &&
            this.props.cropDivHeight - mouseYInCropElement < 10
        ) {
            this.setState({ cursor: "nw-resize" });
        } else if (
            mouseXInCropElement < 10 &&
            this.props.cropDivHeight - mouseYInCropElement < 10
        ) {
            this.setState({ cursor: "sw-resize" });
        } else {
            this.setState({ cursor: null });
        }
    };

    render() {
        const { isDragging, connectDragSource } = this.props;
        if (isDragging) {
            return connectDragSource(<div />);
        }
        return connectDragSource(
            <div
                className="crop-div"
                ref={this.overlappingDiv}
                id={this.props.id}
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
                onMouseMove={this.handleMouseMove}
                style={{
                    width: this.props.cropDivWidth,
                    height: this.props.cropDivHeight,
                    cursor: this.state.cursor || "move",
                    left: this.props.left,
                    top: this.props.top
                }}
            />
        );
    }
}

const mapStateToProps = state => {
    return {
        height: state.height,
        width: state.width,
        cropDivClickedResizeRegion: state.cropDivClickedResizeRegion,
        cropDivWidth: state.cropDivWidth,
        cropDivHeight: state.cropDivHeight,
        cropDivClickInitialX: state.cropDivClickInitialX,
        cropDivClickInitialY: state.cropDivClickInitialY
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setCropDivClickedResizeRegion: flag => {
            dispatch({ type: "SET_RESIZE_REGION_CLICKED", payload: flag });
        },
        setCropDivInitialCoor: (x, y) => {
            dispatch({ type: "SET_CROP_DIV_INITIAL_COOR", payload: { x, y } });
        },
        setCropDivSize: (region, width, height) => {
            dispatch({
                type: "SET_CROP_DIV_SIZE",
                payload: { region, width, height }
            });
        },
        setCropDivLeftAndTop: (top, left) => {
            dispatch({
                type: "SET_CROP_DIV_LEFT_AND_TOP",
                payload: { top, left }
            });
        }
    };
};

export default DragSource("crop-div", cardSource, collect)(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(CropElement)
);
