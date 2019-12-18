import React, { Component } from "react";
import { connect } from "react-redux";
import HTML5Backend from "react-dnd-html5-backend";
import { DragDropContext } from "react-dnd";

import "./App.css";

import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Canvas from "./components/Canvas";
import BrightnessSlider from "./components/sliders/BrightnessSlider";
import ContrastSlider from "./components/sliders/ContrastSlider";
import BlurSlider from "./components/sliders/BlurSlider";
import SaturateSlider from "./components/sliders/SaturateSlider";
import ReturnDefaultButton from "./components/sliders/ReturnDefaultButton";
import TextInput from "./components/TextInput";
import ResizeSection from "./components/ResizeSection";
import RotateSection from "./components/RotateSection";
import WelcomeScreen from "./components/modals/WelcomeScreen";
import Footer from "./components/Footer";
import CropSection from "./components/CropSection";

class App extends Component {
    constructor(props) {
        super(props);
        this.canvasDiv = React.createRef();
    }

    componentDidUpdate() {
        this.props.setWidthAndHeightOfCanvasDiv(
            this.canvasDiv.current.clientWidth,
            this.canvasDiv.current.clientHeight
        );
    }

    render() {
        if (this.props.image) {
            return (
                <div className="App">
                    <div className="wrapper">
                        <div
                            className=" header"
                            style={{ flexDirection: "row" }}
                        >
                            <Header />
                        </div>

                        <div className="middle-wrapper">
                            <div className="side-menu">
                                <div className="icons">
                                    <Navbar />
                                </div>
                                <div className="options">
                                    <BrightnessSlider />
                                    <ContrastSlider />
                                    <SaturateSlider />
                                    <BlurSlider />
                                    <ReturnDefaultButton />
                                    <TextInput />
                                    <ResizeSection />
                                    <RotateSection />
                                    <CropSection />
                                </div>
                            </div>

                            <div className="content" ref={this.canvasDiv}>
                                <Canvas />
                            </div>
                        </div>

                        <div className="footer">
                            <Footer
                                showCropCanvas={this.props.showCropCanvas}
                            />
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="App">
                    <WelcomeScreen />
                </div>
            );
        }
    }
}

const mapDispachToProps = dispatch => {
    return {
        setWidthAndHeightOfCanvasDiv: (width, height) => {
            dispatch({
                type: "SET_WIDTH_AND_HEIGHT_OF_CANVAS_DIV",
                payload: { width, height }
            });
        }
    };
};

const mapStateToProps = state => {
    return {
        image: state.image,
        showCropCanvas: state.showCropCanvas
    };
};

export default connect(
    mapStateToProps,
    mapDispachToProps
)(DragDropContext(HTML5Backend)(App));
