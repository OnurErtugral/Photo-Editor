import React, { Component } from "react";
import { connect } from "react-redux";

import "./resizeSection.css";

class ResizeSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0
        };
    }

    onKeyPress = e => {
        if (e.which === 13) {
            this.props.handleEditExpense(
                this.props.currentInput,
                this.props.labelOfEditedExpense
            );
        }
    };

    handleWidthChange = e => {
        this.setState({ width: e.target.value });
    };
    handleHeighthChange = e => {
        this.setState({ height: e.target.value });
    };

    render() {
        if (this.props.showResizeSection) {
            return (
                <div className="resize-section-wrapper">
                    <div className="resize-section">
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
                            <input
                                type="text"
                                className="form-control"
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                placeholder={this.props.currentWidth}
                                onChange={this.handleWidthChange}
                            />
                            <input
                                type="text"
                                className="form-control"
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                placeholder={this.props.currentHeight}
                                onChange={this.handleHeighthChange}
                            />
                        </div>
                    </div>
                    <button
                        className="btn btn-primary btn-resize-section"
                        onClick={() =>
                            this.props.submitResizeValues(
                                this.state.width,
                                this.state.height
                            )
                        }
                    >
                        Apply
                    </button>
                </div>
            );
        } else {
            return null;
        }
    }
}

const mapDispachToProps = dispatch => {
    return {
        submitResizeValues: (resizedWidth, resizedHeight) => {
            dispatch({
                type: "SET_WIDTH_AND_HEIGHT",
                payload: { width: resizedWidth, height: resizedHeight }
            });
        }
    };
};

const mapStateToProps = state => {
    return {
        resizedWidth: state.resizeWidth,
        resizedHeight: state.resizeHeight,
        currentWidth: state.width,
        currentHeight: state.height,
        showResizeSection: state.showResizeSection
    };
};

export default connect(
    mapStateToProps,
    mapDispachToProps
)(ResizeSection);
