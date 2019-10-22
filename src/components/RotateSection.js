import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/lab/Slider";

import "./rotationSection.css";

const styles = {
    root: {
        width: "200px"
    },
    slider: {
        margin: "9px auto"
    }
};

class RotateSection extends Component {
    render() {
        const { classes } = this.props;

        if (this.props.showRotateSection) {
            return (
                <div className={classes.root}>
                    <div className="flip-button">
                        <button
                            className="btn btn-primary"
                            onClick={() =>
                                this.props.toggleHorizontalFlip(
                                    this.props.horizontalFlip
                                )
                            }
                        >
                            Horizontal Flip
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() =>
                                this.props.toggleVerticalFlip(
                                    this.props.verticalFlip
                                )
                            }
                        >
                            Vertical Flip
                        </button>
                    </div>

                    <div className="rotation-buttons">
                        <button
                            className="btn btn-primary"
                            onClick={this.props.rotate90DegreeLeft}
                        >
                            <i className="fas fa-undo-alt" />
                        </button>

                        <button
                            className="btn btn-primary"
                            onClick={this.props.rotate90DegreeRight}
                        >
                            <i className="fas fa-redo" />
                        </button>
                    </div>
                    <label
                        htmlFor=""
                        style={{ margin: "3px 0px", color: "#f1f1f1" }}
                    >
                        Fine-Tune Rotation:
                    </label>
                    <Slider
                        className={classes.slider}
                        value={this.props.inactValue}
                        max={45}
                        min={-45}
                        step={0.1}
                        onDragEnd={this.props.resetRotate}
                        aria-labelledby="label"
                        onChange={this.props.handleFineTuneRotate}
                    />
                </div>
            );
        } else {
            return null;
        }
    }
}

const mapDispatchToProps = dispatch => {
    return {
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
        rotate90DegreeLeft: e => {
            dispatch({
                type: "ROTATE_90_DEGREE_LEFT",
                payload: -90
            });
        },
        rotate90DegreeRight: e => {
            dispatch({
                type: "ROTATE_90_DEGREE_RIGHT",
                payload: 90
            });
        },
        handleFineTuneRotate: (event, value) => {
            dispatch({
                type: "HANDLE_FINE_TUNE_ROTATE",
                payload: value
            });
        },
        resetRotate: () => {
            dispatch({
                type: "RESET_ROTATE"
            });
        }
    };
};

const mapPropsToState = state => {
    return {
        showRotateSection: state.showRotateSection,
        horizontalFlip: state.horizontalFlip,
        fineTuneRotate: state.fineTuneRotate,
        inactValue: state.inactValue
    };
};

export default withStyles(styles)(
    connect(
        mapPropsToState,
        mapDispatchToProps
    )(RotateSection)
);
