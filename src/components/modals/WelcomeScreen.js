import React, { Component } from "react";
import { connect } from "react-redux";
import { NativeTypes } from "react-dnd-html5-backend";
import { DropTarget } from "react-dnd";
import Spinner from "react-bootstrap/Spinner";

import "./welcomeScreen.css";
import image1 from "../../images/image1.jpg";

const nativeFileTarget = {
    hover(props, monitor, component) {
        monitor.isOver({ shallow: true });
        console.log("hoveringgggggggggg");
    },
    drop(props, monitor, component) {
        // Obtain the dragged item
        console.log("File Dropped");
        component.handleDroppedFiles(monitor);
    }
};

function collect(connect, monitor) {
    return {
        // Call this function inside render()
        // to let React DnD handle the drag events:
        connectDropTarget: connect.dropTarget(),
        isOverCurrent: monitor.isOver({ shallow: false }),
        itemType: monitor.getItemType(),
        didDrop: monitor.didDrop(),

        // You can ask the monitor about the current drag state:
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

    // handleImageClick = e => {
    //     console.log("e.targer: " + e.target);
    //     this.props.setImage();

    // };
    render() {
        const { connectDropTarget, isOver } = this.props;

        let localStorageImage = JSON.parse(localStorage.getItem("image"));
        return (
            <div style={{ height: "100%" }}>
                {localStorageImage ? (
                    <div className="wrapper">
                        <div className="upper-wrapper">
                            <div className="panel-left">
                                <div className="content">
                                    <button
                                        className="btn btn-outline-light"
                                        onClick={e => this.fileInput.click()}
                                    >
                                        Upload Image
                                    </button>
                                    <input
                                        type="file"
                                        style={{ display: "none" }}
                                        onChange={e => this.onImageChange(e)}
                                        ref={fileInput =>
                                            (this.fileInput = fileInput)
                                        }
                                    />
                                    You can also drag and drop images.
                                </div>
                            </div>

                            <div className="panel-right">
                                <div className="header-for-right-panel">
                                    Previously Edited Images
                                </div>
                                <div className="row-flex-wrapper">
                                    <div className="image-wrapper">
                                        <div
                                            className="image-box"
                                            onClick={e =>
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
                                            <i className="fas fa-times" />
                                        </div>
                                        <div className="image-desc">
                                            {localStorageImage.name}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lower-wrapper">
                            {connectDropTarget(
                                <div className="drag-drop-panel">
                                    {this.state.showSpinner ? (
                                        <Spinner
                                            animation="grow"
                                            variant="danger"
                                        />
                                    ) : isOver ? (
                                        <h2>Release to Upload!</h2>
                                    ) : (
                                        <h3>Drag and Drop to Upload</h3>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="wrapper">
                        <div className="upper-wrapper">
                            <div className="panel-left">
                                <div className="content">
                                    <button
                                        className="btn btn-outline-light"
                                        onClick={e => this.fileInput.click()}
                                    >
                                        Upload Image
                                    </button>
                                    <input
                                        type="file"
                                        style={{ display: "none" }}
                                        onChange={e => this.onImageChange(e)}
                                        ref={fileInput =>
                                            (this.fileInput = fileInput)
                                        }
                                    />
                                    You can also drag and drop images.
                                </div>
                            </div>

                            <div className="panel-right">
                                <div className="header-for-right-panel">
                                    Previously Edited Images
                                </div>
                                <div className="row-flex-wrapper">
                                    <div className="image-wrapper">
                                        <div
                                            className="image-box"
                                            onClick={e =>
                                                this.props.setImage(
                                                    localStorageImage.url,
                                                    localStorageImage.name
                                                )
                                            }
                                            style={{}}
                                        />
                                        <div className="image-desc">
                                            Such an empty list!
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lower-wrapper">
                            {connectDropTarget(
                                <div className="drag-drop-panel">
                                    {this.state.showSpinner ? (
                                        <Spinner
                                            animation="grow"
                                            variant="danger"
                                        />
                                    ) : isOver ? (
                                        <h2>Release to Upload!</h2>
                                    ) : (
                                        <h3>Drag and Drop to Upload</h3>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
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
