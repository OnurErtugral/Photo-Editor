import React, { Component } from "react";
import { connect } from "react-redux";
import { DropTarget } from "react-dnd";

import "./canvas.css";
import CropElement from "./CropElement";

const canvasTarget = {
    drop(props, monitor, component) {
        component.updateStateOnDrop(monitor);
    }
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
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

    componentWillMount() {
        window.addEventListener("beforeunload", ev => {
            ev.preventDefault();

            // SAVE TO LOCAL STORAGE
            const node = this.canvasRef.current;
            let imgURL = node.toDataURL("image/png");
            localStorage.removeItem("image");
            localStorage.setItem(
                "image",
                JSON.stringify({
                    name: this.props.imageName,
                    url: imgURL,
                    date: new Date()
                })
            );
        });
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

    drawCanvas(img, prevProps) {
        if (!this.props.width) {
            if (
                img.height + 100 > this.props.canvasDivHeight ||
                img.width + 250 > this.props.canvasDivWidth
            ) {
                // AUTO SCALE
                let diffHeight = img.height + 145 - this.props.canvasDivHeight;
                let diffWidth = img.width + 250 - this.props.canvasDivWidth;
                if (diffHeight > 3500 || diffWidth > 3500) {
                    this.props.handleScaleChange(15);
                } else if (diffHeight > 3000 || diffWidth > 3000) {
                    this.props.handleScaleChange(20);
                } else if (diffHeight > 2500 || diffWidth > 2500) {
                    this.props.handleScaleChange(25);
                } else if (diffHeight > 2000 || diffWidth > 2000) {
                    this.props.handleScaleChange(30);
                } else if (diffHeight > 1000 || diffWidth > 1000) {
                    this.props.handleScaleChange(40);
                } else if (diffHeight > 800 || diffWidth > 800) {
                    this.props.handleScaleChange(50);
                } else if (diffHeight > 600 || diffWidth > 600) {
                    this.props.handleScaleChange(60);
                } else if (diffHeight > 400 || diffWidth > 400) {
                    this.props.handleScaleChange(70);
                } else if (diffHeight > 200 || diffWidth > 200) {
                    this.props.handleScaleChange(80);
                } else if (diffHeight <= 200) {
                    this.props.handleScaleChange(95);
                }
            }
            this.props.setWidthAndHeight(img.width, img.height);
        }

        const node = this.canvasRef.current;
        const context = node.getContext("2d");

        // HORIZONTAL FLIP
        if (this.props.horizontalFlip) {
            context.translate(this.props.width, 0);
            context.scale(-1, 1);
            this.props.toggleHorizontalFlip(this.props.horizontalFlip);
        }

        // VERTICAL FLIP
        if (this.props.verticalFlip) {
            context.translate(0, this.props.height);
            context.scale(1, -1);
            this.props.toggleVerticalFlip(this.props.verticalFlip);
        }

        // ROTATE IMAGE
        if (this.props.showRotateSection) {
            context.fillRect(0, 0, this.props.width, this.props.height);
            context.fillStyle = "#000000";

            // Move registration point to the center of the canvas
            context.translate(this.props.width / 2, this.props.height / 2);

            context.rotate((this.props.rotateCanvas * Math.PI) / 180);

            // // Rotate 1 degree
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
        }

        context.drawImage(img, 0, 0, this.props.width, this.props.height);

        // TEXT
        context.font = "bold " + this.props.textSize + "px Arial";
        context.fillStyle = this.props.inputColor;
        context.textAlign = "center";
        context.fillText(
            this.props.textInput,
            this.props.width / 2,
            this.props.height / 2
        );

        if (this.props.downloadImageFlag) {
            let imgURL = node.toDataURL("image/png");
            this.props.setImgURL(imgURL);
            this.props.downloadImage(imgURL);
        }
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.showCropCanvas !== this.props.showCropCanvas ||
            prevProps.showRotateSection !== this.props.showRotateSection ||
            prevProps.showSlider !== this.props.showSlider ||
            prevProps.showTextField !== this.props.showTextField
        ) {
        } else {
            var img = new Image();
            img.src = this.props.image;
            img.onload = () => this.drawCanvas(img, prevProps);
        }
    }

    handleMouseUp = e => {
        let mouseXInCropElement = e.nativeEvent.offsetX;
        let mouseYInCropElement = e.nativeEvent.offsetY;

        let diffX =
            mouseXInCropElement -
            (this.props.cropDivClickInitialX + this.props.cropDivLeft);

        let diffY =
            mouseYInCropElement -
            (this.props.cropDivClickInitialY + this.props.cropDivTop);

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

    render() {
        const { connectDropTarget } = this.props;

        return connectDropTarget(
            <div
                id="canvas-wrap"
                style={{
                    maxHeight: this.props.canvasDivHeight - 50,
                    maxWidth: this.props.canvasDivWidth
                }}
            >
                <canvas
                    ref={this.canvasRef}
                    width={this.props.width || 500}
                    height={this.props.height || 500}
                    onMouseUp={this.handleMouseUp}
                    onMouseMove={this.handleOnMouseMove}
                    style={{
                        transform: "scale(" + this.props.scaleValue / 100 + ")"
                    }}
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
        downloadImageFlag: state.downloadImageFlag,
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
        cropImage: state.cropImage,
        showSlider: state.showSlider
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
