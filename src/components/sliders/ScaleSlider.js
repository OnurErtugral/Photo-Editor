import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/lab/Slider";
import { connect } from "react-redux";

import "./scaleSlider.css";

const styles = {
    root: {
        width: "200px",
        marginTop: "auto"
    },
    slider: {}
};

class ScaleSlider extends Component {
    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <div className="scale-slider-wrapper">
                    <label htmlFor="">
                        Scale: {this.props.scaleValue + "%"}{" "}
                    </label>
                    <Slider
                        className={classes.slider}
                        value={this.props.scaleValue}
                        max={200}
                        min={10}
                        aria-labelledby="label"
                        onChange={this.props.handleScaleChange}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        scaleValue: state.scaleValue
    };
};

const mapDispatchToProps = dispatch => {
    return {
        handleScaleChange: (event, value) => {
            dispatch({
                type: "HANDLE_SCALE_CHANGE",
                payload: value
            });
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(ScaleSlider));
