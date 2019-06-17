import React, { Component } from "react";
import { connect } from "react-redux";

import "./cropSection.css";

class CropSection extends Component {
    render() {
        if (this.props.showCropCanvas) {
            return (
                <div className="crop-section-wrapper">
                    <div className="crop-section">
                        <div className="left-section">
                            <label
                                className="label label-resize"
                                htmlFor="resize-width"
                            >
                                Width:
                            </label>
                            <label
                                className="label label-resize"
                                htmlFor="resize-height"
                            >
                                Heigth:
                            </label>
                        </div>

                        <div className="right-section">
                            <label for="">{this.props.cropDivWidth}</label>

                            <label for="">{this.props.cropDivHeight}</label>
                        </div>
                    </div>
                    <button
                        className="btn btn-primary btn-block btn-crop-section"
                        onClick={() =>
                            this.props.handleCropImage(this.props.cropImage)
                        }
                    >
                        Crop
                    </button>
                </div>
            );
        } else {
            return null;
        }
    }
}

const mapStateToProps = state => {
    return {
        cropDivWidth: state.cropDivWidth,
        cropDivHeight: state.cropDivHeight,
        cropDivTop: state.cropDivTop,
        cropDivLeft: state.cropDivLeft,
        showCropCanvas: state.showCropCanvas,
        cropImage: state.cropImage
    };
};

const mapDispatchToProps = dispatch => {
    return {
        handleCropImage: cropImage => {
            dispatch({ type: "CROP_IMAGE", payload: cropImage });
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CropSection);
