import React, { Component } from "react";
import { connect } from "react-redux";
import { NativeTypes } from "react-dnd-html5-backend";
import { DropTarget } from "react-dnd";
import Spinner from "react-bootstrap/Spinner";

import "./welcomeScreen.css";
import DEFAULT_IMAGE_URL from "../constants/constants";

const EXAMPLE_PHOTO = {
    name: "9392366.jpg",
    url: DEFAULT_IMAGE_URL
};

const nativeFileTarget = {
    hover(props, monitor, component) {
        monitor.isOver({ shallow: true });
    },
    drop(props, monitor, component) {
        component.handleDroppedFiles(monitor);
    }
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOverCurrent: monitor.isOver({ shallow: false }),
        itemType: monitor.getItemType(),
        didDrop: monitor.didDrop(),

        isOver: monitor.isOver()
    };
}

class WelcomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSpinner: false
        };
    }
    handleDroppedFiles(monitor) {
        console.log("monitor.getItem().files: " + monitor.getItem().files);
        this.setState({ showSpinner: true }, () => {
            this.onImageChange({ target: { files: monitor.getItem().files } });
        });
    }

    onImageChange(event) {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            let file = event.target.files[0];
            reader.fileName = file.name;

            reader.onloadend = upload => {
                this.props.handleUploadedFile(upload.target);
            };
            reader.readAsDataURL(file);
        }
    }

    handleCrossClick = e => {
        e.stopPropagation();
        localStorage.clear("image");
        this.forceUpdate();
    };

    render() {
        const { connectDropTarget, isOver } = this.props;

        let localStorageImage = JSON.parse(localStorage.getItem("image"));
        return (
            <div style={{ height: "100%" }}>
                <div className="wrapper">
                    <div className="upper-wrapper">
                        <div className="panel-left">
                            <div className="content">
                                <div className="content-image-wrapper">
                                    <div className="contentHeader">
                                        Example Photo
                                    </div>
                                    <img
                                        src={EXAMPLE_PHOTO.url}
                                        style={{
                                            height: "80%",
                                            width: "75%",
                                            borderRadius: 7,
                                            objectFit: "cover"
                                        }}
                                        alt="Example Img"
                                        onClick={() =>
                                            this.props.setImage(
                                                EXAMPLE_PHOTO.url,
                                                EXAMPLE_PHOTO.name
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {localStorageImage ? (
                            <div className="panel-right">
                                <div className="header-for-right-panel">
                                    Previously Edited Images
                                </div>
                                <div className="row-flex-wrapper">
                                    <div className="image-wrapper">
                                        <div
                                            className="image-box"
                                            onClick={() =>
                                                this.props.setImage(
                                                    localStorageImage.url,
                                                    localStorageImage.name
                                                )
                                            }
                                            style={{
                                                backgroundImage: `url(${
                                                    localStorageImage.url
                                                }`
                                            }}
                                        >
                                            <i
                                                className="fas fa-times"
                                                onClick={this.handleCrossClick}
                                            />
                                        </div>
                                        <div className="image-desc">
                                            {localStorageImage.name}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="panel-right">
                                <div className="header-for-right-panel">
                                    Previously Edited Images
                                </div>
                                <div className="row-flex-wrapper">
                                    <div className="image-wrapper">
                                        <div
                                            className="image-box"
                                            style={{ cursor: "auto" }}
                                        />
                                        <div className="image-desc">
                                            Such an empty list!
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lower-wrapper">
                        <div className="lower-left-panel">{/* HELlo */}</div>

                        {connectDropTarget(
                            <div
                                className="drag-drop-panel"
                                onClick={e => this.fileInput.click()}
                            >
                                {this.state.showSpinner ? (
                                    <Spinner
                                        animation="grow"
                                        variant="danger"
                                    />
                                ) : isOver ? (
                                    <h2>Release to Upload!</h2>
                                ) : (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column"
                                        }}
                                    >
                                        <h3>Drag and Drop to Upload</h3>
                                        <span style={{ fontSize: 17 }}>
                                            Or Click Here
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                        <input
                            type="file"
                            style={{ display: "none" }}
                            onChange={e => this.onImageChange(e)}
                            ref={fileInput => (this.fileInput = fileInput)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispachToProps = dispatch => {
    return {
        handleUploadedFile: file => {
            dispatch({ type: "HANDLE_FILE_UPLOAD", payload: file });
        },
        setImage: (image, name) => {
            dispatch({
                type: "SET_IMAGE_FROM_WELCOME_SCREEN",
                payload: { result: image, fileName: name }
            });
        }
    };
};

const mapStateToProps = state => {
    return { image: state.image };
};

export default connect(
    mapStateToProps,
    mapDispachToProps
)(DropTarget(NativeTypes.FILE, nativeFileTarget, collect)(WelcomeScreen));
