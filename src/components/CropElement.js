import React, { Component } from "react";
import { connect } from "react-redux";
import { DragSource } from "react-dnd";

import "./cropElement.css";

const cardSource = {
    canDrag(props) {
        console.log("candrag: " + props.flag);
        return !props.flag;
    },
    isDragging(props, monitor) {
        // If your component gets unmounted while dragged
        // (like a card in Kanban board dragged between lists)
        // you can implement something like this to keep its
        // appearance dragged:
        //   return monitor.getItem().id === props.id
        return monitor.getItem().id === props.id;
    },

    beginDrag(props, monitor, component) {
        // Return the data describing the dragged item

        const item = { id: props.id, left: props.left, top: props.top };
        return item;
    }
};

/**
 * Specifies which props to inject into your component.
 */
function collect(connect, monitor) {
    return {
        // Call this function inside render()
        // to let React DnD handle the drag events:
        connectDragSource: connect.dragSource(),
        // You can ask the monitor about the current drag state:
        isDragging: monitor.isDragging()
    };
}

class CropElement extends Component {
    constructor(props) {
        super(props);
        this.overlappingDiv = React.createRef();
        this.state = {
            clickedResizeRegion: false,
            initialX: null,
            initialY: null
        };
    }

    handleOnMouseDown = e => {
        let postion = this.overlappingDiv.current.getBoundingClientRect();
        let canvasPosition = this.props.canvasRef.current.getBoundingClientRect();

        let mouseX = e.screenX;
        let mouseY = e.screenY;

        let divTop = canvasPosition.top + this.props.top + 60 + 5;
        let divBottom =
            canvasPosition.top +
            this.props.top +
            this.props.cropDivHeight +
            60 +
            5;
        let divLeft = canvasPosition.left + this.props.left;
        let divRight =
            canvasPosition.left + this.props.left + this.props.cropDivWidth;

        console.log("divBottom: " + divBottom + " mouseY: " + mouseY);
        let divWidth = this.props.cropDivWidth;
        let divHeight = this.props.cropDivHeight;

        let mouseXInsideDiv = mouseX - divLeft;
        let mouseYInsideDiv = mouseY - divTop;

        if (divBottom - mouseY < 17 && divRight - mouseX < 17) {
            console.log("right bottom clicked");
            this.props.setCropDivClickedResizeRegion("RB");
            this.props.setCropDivInitialCoor(mouseX, mouseY);
        } else if (divRight - mouseX < 17 && mouseY - divTop < 17) {
            console.log("right Top clicked");
            this.props.setCropDivClickedResizeRegion("RT");
            this.props.setCropDivInitialCoor(mouseX, mouseY);
        } else if (mouseX - divLeft < 17 && mouseY - divTop < 17) {
            console.log("left Top clicked");
            this.props.setCropDivClickedResizeRegion("LT");
            this.props.setCropDivInitialCoor(mouseX, mouseY);
        } else if (mouseX - divLeft < 17 && divBottom - mouseY < 17) {
            console.log("left Btoom clicked");
            this.props.setCropDivClickedResizeRegion("LB");
            this.props.setCropDivInitialCoor(mouseX, mouseY);
        }
    };

    handleOnMouseUp = e => {
        if (this.props.cropDivClickedResizeRegion === "RB") {
            let mouseX = e.screenX;
            let mouseY = e.screenY;

            let diffX = mouseX - this.props.cropDivClickInitialX;
            let diffY = mouseY - this.props.cropDivClickInitialY;
            this.props.setCropDivSize("RB", diffX, diffY);
        } else if (this.props.cropDivClickedResizeRegion === "RT") {
            let mouseX = e.screenX;
            let mouseY = e.screenY;

            let diffX = mouseX - this.props.cropDivClickInitialX;
            let diffY = mouseY - this.props.cropDivClickInitialY;

            this.props.setCropDivLeftAndTop(diffY, 0);
            this.props.setCropDivSize("RT", diffX, -diffY);
        } else if (this.props.cropDivClickedResizeRegion === "LT") {
            let mouseX = e.screenX;
            let mouseY = e.screenY;

            let diffX = mouseX - this.props.cropDivClickInitialX;
            let diffY = mouseY - this.props.cropDivClickInitialY;

            this.props.setCropDivLeftAndTop(diffY, diffX);
            this.props.setCropDivSize("LT", -diffX, -diffY);
        } else if (this.props.cropDivClickedResizeRegion === "LB") {
            let mouseX = e.screenX;
            let mouseY = e.screenY;

            let diffX = mouseX - this.props.cropDivClickInitialX;
            let diffY = mouseY - this.props.cropDivClickInitialY;
            this.props.setCropDivLeftAndTop(0, diffX);
            this.props.setCropDivSize("LT", -diffX, diffY);
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
                onClick={this.handleOnClick}
                onMouseDown={this.handleOnMouseDown}
                onMouseUp={this.handleOnMouseUp}
                style={{
                    width: this.props.cropDivWidth,
                    height: this.props.cropDivHeight,
                    cursor: "move",
                    left: this.props.left,
                    top: this.props.top
                }}
            >
                <div className="RB" />
                <div className="RT" />
                <div className="LB" />
                <div className="LT" />
            </div>
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
