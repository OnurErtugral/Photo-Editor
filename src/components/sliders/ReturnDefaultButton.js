import React from "react";
import { connect } from "react-redux";

class ReturnDefaultButton extends React.Component {
    render() {
        return (
            <div>
                {this.props.showSlider ? (
                    <div>
                        <button
                            className="btn btn-primary btn-block"
                            style={{ borderRadius: "7px" }}
                            onClick={this.props.handleReturnDefaultButton}
                        >
                            Default{" "}
                        </button>
                    </div>
                ) : null}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { showSlider: state.showSlider };
};

const mapDispatchToProps = dispatch => {
    return {
        handleReturnDefaultButton: () => {
            dispatch({
                type: "HANDLE_RETURN_DEFAULT_BUTTON"
            });
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReturnDefaultButton);
