import React, { Component } from "react";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";

import firebase from "../config/firebaseConfig";
import "./header.css";

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sentEmailFlag: false,
            emailIndicator: "",
            emailSuccess: false,
            emailFailer: false,
            email: null
        };
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

    handleSendEmail = () => {
        this.setState({
            sentEmailFlag: true,
            emailIndicator: "Your request is being processed..."
        });
        let imageForEmail = this.props.imgURL.split(",")[1];

        var sendMail = firebase.functions().httpsCallable("sendMail");
        sendMail({
            fileName: this.props.imageName,
            email: this.state.email,
            content: imageForEmail
        })
            .then(result => {
                console.log("Header.js Returned Result: " + result);
                this.setState(
                    {
                        emailSuccess: true,
                        sentEmailFlag: false,
                        emailIndicator: "Email has been sent successfully!"
                    },

                    () => {
                        setTimeout(() => {
                            this.setState({
                                emailSuccess: false,
                                emailIndicator: ""
                            });
                            this.buttonElement.click();
                        }, 3900);
                    }
                );
            })
            .catch(err => {
                console.log("Something gone wrong!");
                this.setState(
                    {
                        emailFailer: true,
                        emailIndicator: "Something gone wrong!",
                        sentEmailFlag: false,
                        emailSuccess: false
                    },
                    () => {
                        setTimeout(() => {
                            this.setState({
                                emailFailer: false,
                                emailIndicator: ""
                            });
                            this.buttonElement.click();
                        }, 3900);
                    }
                );
            });
    };

    handleChange = e => {
        this.setState({ email: e.target.value });
    };

    render() {
        return (
            <div className="header-container">
                <div className="left-side">
                    <div
                        className="header-icons"
                        onClick={() => this.fileInput.click()}
                        data-tip="Upload Image"
                    >
                        <i className="fas fa-lg fa-file-upload" />
                    </div>
                    <input
                        type="file"
                        style={{ display: "none" }}
                        onChange={e => this.onImageChange(e)}
                        ref={fileInput => (this.fileInput = fileInput)}
                    />
                </div>
                <div className="center-part">
                    {this.state.sentEmailFlag ? (
                        <div className="alert alert-info p-2 m-0" role="alert">
                            {this.state.emailIndicator}
                        </div>
                    ) : null}

                    {this.state.emailSuccess ? (
                        <div
                            className="alert alert-success p-2 m-0"
                            role="alert"
                        >
                            {this.state.emailIndicator}
                        </div>
                    ) : null}
                    {this.state.emailFailer ? (
                        <div
                            className="alert alert-danger p-2 m-0"
                            role="alert"
                        >
                            {this.state.emailIndicator}
                        </div>
                    ) : null}
                </div>
                <div className="right-side">
                    <div>
                        {this.props.image ? (
                            <>
                                <button
                                    className="btn btn-primary"
                                    ref={button =>
                                        (this.buttonElement = button)
                                    }
                                    data-tip
                                    data-for="clickme"
                                    data-event="click"
                                    // onClick={this.handleSendEmail}
                                >
                                    Send Email
                                    <i className="far fa-envelope fa-lg pl-2" />
                                </button>

                                <button
                                    className="btn btn-success"
                                    onClick={this.props.setDownloadImageFlag}
                                    data-toggle="tooltip"
                                    data-placement="bottom"
                                    title="Download image"
                                >
                                    Download
                                    <i className="fas fa-file-download fa-lg pl-2" />
                                </button>
                            </>
                        ) : null}
                    </div>
                </div>
                <ReactTooltip place="right" type="info" />
                <ReactTooltip
                    id="clickme"
                    place="bottom"
                    effect="solid"
                    clickable={true}
                >
                    <div className="inside-wrapper">
                        <input
                            type="email"
                            placeholder="Your email"
                            onChange={this.handleChange}
                        />
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={this.handleSendEmail}
                        >
                            <i className="far fa-paper-plane" />
                        </button>
                    </div>
                    <small>We do not store your email address.</small>
                </ReactTooltip>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        handleUploadedFile: e => {
            dispatch({ type: "HANDLE_FILE_UPLOAD", payload: e });
        },
        setDownloadImageFlag: () => {
            dispatch({ type: "SET_DOWNLOAD_IMAGE_FLAG" });
        }
    };
};

const mapPropsToState = state => {
    return {
        errorMessage: state.errorMessage,
        image: state.image,
        imageName: state.imageName,
        imgURL: state.imgURL
    };
};

export default connect(
    mapPropsToState,
    mapDispatchToProps
)(Header);
