import React, { Component } from "react";
import { connect } from "react-redux";
import { HuePicker } from "react-color";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/lab/Slider";

const styles = {
    root: {
        width: "90%",
        margin: "auto"
    },
    slider: {
        padding: "5px 0px",
        margin: "auto",
        color: "red"
    }
};

class TextInput extends Component {
    render() {
        const { classes } = this.props;

        return (
            <div className="text-input-div" style={{}}>
                {this.props.showTextField ? (
                    <div
                        className="inside-text-input"
                        style={{
                            margin: "2px 5px",

                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                        }}
                    >
                        <label
                            htmlFor="text-input"
                            style={{ color: "#f1f1f1" }}
                        >
                            Your text
                        </label>
                        <input
                            type="text"
                            id="text-input"
                            placeholder="Type something"
                            style={{
                                borderRadius: "7px",
                                marginBottom: "7px"
                            }}
                            onChange={this.props.handleTextChange}
                            value={this.props.textInput}
                        />

                        {/* TEXT SIZE */}
                        <label
                            htmlFor=""
                            style={{ color: "#f1f1f1", marginTop: "10px" }}
                        >
                            Text Size: {Math.floor(this.props.textSize)}
                        </label>
                        <div className={classes.root}>
                            <Slider
                                classes={{ container: classes.slider }}
                                value={this.props.textSize}
                                aria-labelledby="label"
                                onChange={this.props.handleTextSizeChange}
                            />
                        </div>

                        <label
                            htmlFor=""
                            style={{ color: "#f1f1f1", marginTop: "10px" }}
                        >
                            Color
                        </label>
                        <div>
                            <HuePicker
                                width="200px"
                                onChangeComplete={
                                    this.props.handleChangeComplete
                                }
                            />
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}

TextInput.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        showTextField: state.showTextField,
        textSize: state.textSize,
        textInput: state.textInput
    };
};

const mapDispatchToProps = dispatch => {
    return {
        handleTextChange: e => {
            dispatch({ type: "HANDLE_TEXT_CHANGE", payload: e.target.value });
        },
        handleChangeComplete: e => {
            dispatch({ type: "HANDLE_COLOR_CHANGE", payload: e.hex });
        },
        handleTextSizeChange: (event, value) => {
            dispatch({ type: "HANDLE_TEXT_SIZE_CHANGE", payload: value });
        },
        setSaveTextFlag: flag => {
            dispatch({ type: "SET_SAVE_TEXT_FLAG", payload: flag });
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(TextInput));
