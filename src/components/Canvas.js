import React, { Component } from "react";
import { connect } from "react-redux";
import { DropTarget } from "react-dnd";

import "../canvas.css";
import CropElement from "./CropElement";

const canvasTarget = {
    drop(props, monitor, component) {
        component.updateStateOnDrop(monitor);
    }
};

//  Specifies which props to inject into your component.
function collect(connect, monitor) {
    return {
        // Call this function inside render()
        // to let React DnD handle the drag events:
        connectDropTarget: connect.dropTarget(),
        // You can ask the monitor about the current drag state:
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        itemType: monitor.getItemType(),
        monitor: monitor
    };
}

class Canvas extends Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }

    updateStateOnDrop(monitor) {
        const item = monitor.getItem();
        const delta = monitor.getDifferenceFromInitialOffset();
        let left = Math.round(item.left + delta.x);
        let top = Math.round(item.top + delta.y);

        if (left <= 0) {
            left = 0;
        } else if (left + this.props.cropDivWidth >= this.props.width) {
            left = this.props.width - this.props.cropDivWidth;
        }
        if (top <= 0) {
            top = 0;
        } else if (top + this.props.cropDivHeight >= this.props.height) {
            top = this.props.height - this.props.cropDivHeight;
        }

        this.props.setCropDivLeftAndTopPlain(top, left);
    }

    drawCanvas(img) {
        if (!this.props.width) {
            if (img.height + 100 > this.props.canvasDivHeight) {
                // AUTO SCALE
                let diff = img.height + 100 - this.props.canvasDivHeight;
                if (diff > 1000) {
                    this.props.handleScaleChange(40);
                } else if (diff > 800) {
                    this.props.handleScaleChange(50);
                } else if (diff > 600) {
                    this.props.handleScaleChange(60);
                } else if (diff > 400) {
                    this.props.handleScaleChange(70);
                } else if (diff > 200) {
                    this.props.handleScaleChange(80);
                } else if (diff <= 200) {
                    this.props.handleScaleChange(95);
                }
            }
            this.props.setWidthAndHeight(img.width, img.height);
        }
        const node = this.canvasRef.current;
        const context = node.getContext("2d");

        // HORIZONTAL AND VERTICAL FLIP
        if (this.props.horizontalFlip) {
            context.translate(this.props.width, 0);
            context.scale(-1, 1);
            this.props.toggleHorizontalFlip(this.props.horizontalFlip);
        }

        if (this.props.verticalFlip) {
            context.translate(0, this.props.height);
            context.scale(1, -1);
            this.props.toggleVerticalFlip(this.props.verticalFlip);
        }

        // ROTATE IMAGE
        if (this.props.showRotateSection) {
            context.fillRect(0, 0, this.props.width, this.props.height);

            // Move registration point to the center of the canvas
            context.translate(this.props.width / 2, this.props.height / 2);

            context.rotate((this.props.rotateCanvas * Math.PI) / 180);
            // Rotate 1 degree
            context.rotate((this.props.fineTuneRotate * Math.PI) / 180);

            // Move registration point back to the top left corner of canvas
            context.translate(-this.props.width / 2, -this.props.height / 2);
            this.props.resetRotate();
        }

        // BRIGHTNESS
        let brightness =
            "brightness(" +
            (50 + this.props.brightnessValue).toString() +
            "%) ";

        // CONTRAST
        let contrast =
            "contrast(" + (50 + this.props.contrastValue).toString() + "%) ";

        // BLUR
        let blur = "blur(" + (this.props.blurValue / 18).toString() + "px) ";

        //SATURATE
        let saturate =
            "saturate(" + (50 + this.props.saturateValue).toString() + "%) ";

        context.filter = brightness + contrast + blur + saturate;

        if (this.props.cropImage) {
            this.props.setWidthAndHeight(
                this.props.cropDivWidth,
                this.props.cropDivHeight
            );
            context.drawImage(
                img,
                this.props.cropDivLeft,
                this.props.cropDivTop,
                this.props.cropDivWidth,
                this.props.cropDivHeight,
                0,
                0,
                this.props.cropDivWidth,
                this.props.cropDivHeight
            );
            let imgURL = node.toDataURL("image/png");
            this.props.handleUploadedFile({
                result: imgURL,
                fileName: this.props.imageName,
                width: this.props.cropDivWidth,
                height: this.props.cropDivHeight
            });
        } else {
            context.drawImage(img, 0, 0, this.props.width, this.props.height);
        }

        // TEXT
        context.font = "bold " + this.props.textSize + "px Arial";
        context.fillStyle = this.props.inputColor;
        context.textAlign = "center";
        context.fillText(
            this.props.textInput,
            this.props.width / 2,
            this.props.height / 2
        );

        let imgURL = node.toDataURL("image/png");
        this.props.setImgURL(imgURL);
        if (this.props.imgURLFlag) {
            this.props.downloadImage(imgURL);
        }
        // SAVE TO LOCAL STORAGE
        if (this.props.image) {
            localStorage.removeItem("image");
            localStorage.setItem(
                "image",
                JSON.stringify({
                    name: this.props.imageName,
                    url: imgURL,
                    date: new Date()
                })
            );
        }
    }

    componentDidUpdate() {
        var img = new Image();
        img.src = this.props.image;
        img.onload = () => this.drawCanvas(img);
    }

    handleOnMouseUp = e => {
        if (this.props.cropDivClickedResizeRegion === "RB") {
            let postion = this.canvasRef.current.getBoundingClientRect();

            let mouseX = e.screenX;
            let mouseY = e.screenY;

            let diffX = mouseX - this.props.cropDivClickInitialX;
            let diffY = mouseY - this.props.cropDivClickInitialY;

            // if (
            //     this.props.cropDivLeft + 10 < mouseX ||
            //     this.props.cropDivTop + 10 > mouseY
            // ) {
            //     console.log("dangerouss!");
            // }

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
        const { connectDropTarget } = this.props;

        return connectDropTarget(
            <div
                id="canvas-wrap"
                style={{
                    transform: "scale(" + this.props.scaleValue / 100 + ")",
                    maxHeight: this.props.canvasDivHeight - 50,
                    maxWidth: this.props.canvasDivWidth
                }}
            >
                <canvas
                    ref={this.canvasRef}
                    width={this.props.width || 500}
                    height={this.props.height || 500}
                    onMouseUp={this.handleOnMouseUp}
                    onMouseMove={this.handleOnMouseMove}
                />
                {this.props.showCropCanvas ? (
                    <CropElement
                        key={1}
                        id={1}
                        flag={this.props.cropDivClickedResizeRegion}
                        left={this.props.cropDivLeft}
                        top={this.props.cropDivTop}
                        canvasRef={this.canvasRef}
                    />
                ) : null}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        image: state.image,
        height: state.height,
        width: state.width,
        imageName: state.imageName,
        brightnessValue: state.brightnessSliderValue,
        contrastValue: state.contrastSliderValue,
        blurValue: state.blurSliderValue,
        saturateValue: state.saturateSliderValue,
        showCropCanvas: state.showCropCanvas,
        textInput: state.textInput,
        showTextField: state.showTextField,
        inputColor: state.inputColor,
        textSize: state.textSize,
        imgURLFlag: state.imgURLFlag,
        scaleValue: state.scaleValue,
        horizontalFlip: state.horizontalFlip,
        verticalFlip: state.verticalFlip,
        rotateCanvas: state.rotateCanvas,
        fineTuneRotate: state.fineTuneRotate,
        showRotateSection: state.showRotateSection,
        canvasDivHeight: state.canvasDivHeight,
        canvasDivWidth: state.canvasDivWidth,
        cropDivClickedResizeRegion: state.cropDivClickedResizeRegion,
        cropDivClickInitialX: state.cropDivClickInitialX,
        cropDivClickInitialY: state.cropDivClickInitialY,
        cropDivWidth: state.cropDivWidth,
        cropDivHeight: state.cropDivHeight,
        cropDivTop: state.cropDivTop,
        cropDivLeft: state.cropDivLeft,
        cropImage: state.cropImage
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setWidthAndHeight: (width, height) => {
            dispatch({
                type: "SET_WIDTH_AND_HEIGHT",
                payload: { width, height }
            });
        },
        downloadImage: imgURL => {
            dispatch({ type: "DOWNLOAD_IMAGE", payload: imgURL });
        },
        toggleHorizontalFlip: horizontalFlip => {
            dispatch({
                type: "TOGGLE_HORIZONTAL_FLIP",
                payload: horizontalFlip
            });
        },
        toggleVerticalFlip: verticalFlip => {
            dispatch({
                type: "TOGGLE_VERTICAL_FLIP",
                payload: verticalFlip
            });
        },
        resetRotate: () => {
            dispatch({
                type: "RESET_ROTATE"
            });
        },
        setImgURL: imgURL => {
            dispatch({
                type: "SET_IMG_URL",
                payload: imgURL
            });
        },
        handleScaleChange: value => {
            dispatch({
                type: "HANDLE_SCALE_CHANGE",
                payload: value
            });
        },
        setCropDivClickedResizeRegion: flag => {
            dispatch({ type: "SET_RESIZE_REGION_CLICKED", payload: flag });
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
        },
        setCropDivLeftAndTopPlain: (top, left) => {
            dispatch({
                type: "SET_CROP_DIV_LEFT_AND_TOP_PLAIN",
                payload: { top, left }
            });
        },
        handleCropImage: cropImage => {
            dispatch({ type: "CROP_IMAGE", payload: cropImage });
        },
        handleUploadedFile: e => {
            dispatch({ type: "HANDLE_FILE_UPLOAD", payload: e });
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DropTarget("crop-div", canvasTarget, collect)(Canvas));
