const initialState = {
    image: null,
    imageName: null,
    height: null,
    width: null,
    showResizeSection: false,
    brightnessSliderValue: 50,
    showSlider: false,
    contrastSliderValue: 50,
    blurSliderValue: 0,
    saturateSliderValue: 50,
    showCropCanvas: false,
    showTextField: false,
    textInput: "",
    inputColor: null,
    textSize: 16,
    imgURLFlag: false,
    scaleValue: 100,
    showRotateSection: false,
    horizontalFlip: false,
    verticalFlip: false,
    rotateCanvas: 0,
    fineTuneRotate: 0,
    inactValue: 0,
    imgURL: null,
    canvasDivHeight: null,
    canvasDivWidth: null,
    cropDivClickedResizeRegion: false,
    cropDivClickInitialX: null,
    cropDivClickInitialY: null,
    cropDivWidth: 150,
    cropDivHeight: 150,
    cropDivTop: 0,
    cropDivLeft: 0,
    cropImage: false
};

const scaleConstant = [
    ["%10", 0.1],
    ["%20", 0.2],
    ["%30", 0.3],
    ["%40", 0.4],
    ["%50", 0.5],
    ["%60", 0.6],
    ["%70", 0.7],
    ["%80", 0.8],
    ["%90", 0.9],
    ["%100", 1.0],
    ["%110", 1.1],
    ["%120", 1.2],
    ["%130", 1.3],
    ["%150", 1.5],
    ["%200", 2.0],
    ["%300", 3.0]
];

const UploadImageReducer = (state = initialState, action) => {
    if (action.type === "HANDLE_FILE_UPLOAD") {
        console.log(action.payload.result);
        return {
            ...state,
            image: action.payload.result,
            imageName: action.payload.fileName,
            errorMessage: "",
            width: action.payload.width || null,
            height: action.payload.height || null,
            cropImage: false,
            cropDivLeft: 0,
            cropDivTop: 0
        };
    }

    if (action.type === "SET_IMAGE_FROM_WELCOME_SCREEN") {
        return {
            ...state,
            image: action.payload.result,
            imageName: action.payload.fileName,
            errorMessage: "",
            width: null,
            height: null
        };
    }

    if (action.type === "SET_WIDTH_AND_HEIGHT") {
        return {
            ...state,
            width: parseInt(action.payload.width),
            height: parseInt(action.payload.height)
        };
    }

    if (action.type === "SET_IMAGE_NAME") {
        return {
            ...state,
            imageName: action.payload
        };
    }

    if (action.type === "SHOW_RESIZE_SECTION") {
        console.log("resize: " + state.showResizeSection);
        if (!state.image)
            return {
                ...state,
                showResizeSection: false,
                showSlider: false,
                showCropCanvas: false,
                showTextField: false,
                errorMessage: "Please upload an image first!"
            };
        return {
            ...state,
            showResizeSection: !action.payload,
            showSlider: false,
            showCropCanvas: false,
            showTextField: false,
            showRotateSection: false,
            errorMessage: ""
        };
    }

    if (action.type === "SUBMIT_RESIZED_VALUES") {
        console.log(
            "window.outerWidth: " +
                window.outerWidth +
                " window.outerHeight: " +
                window.outerHeight +
                " width: " +
                action.payload.width +
                " height: " +
                action.payload.heigth
        );
        if (action.payload.heigth >= window.outerHeight * 0.75) {
            console.log("if rescale true");
            return {
                ...state,
                width: action.payload.width,
                height: action.payload.heigth,
                showResizeSection: false,
                scaleCanvas: true
            };
        } else {
            console.log("if rescale false");
            return {
                ...state,
                width: action.payload.width,
                height: action.payload.heigth,
                showResizeSection: false,
                scaleCanvas: false
            };
        }
    }

    if (action.type === "SHOW_SLIDER") {
        return {
            ...state,
            showSlider: !action.payload,
            showCropCanvas: false,
            showTextField: false,
            showResizeSection: false,
            showRotateSection: false,
            errorMessage: ""
        };
    }

    if (action.type === "HANDLE_BRIGHTNESS_CHANGE") {
        return {
            ...state,
            brightnessSliderValue: action.payload
        };
    }

    if (action.type === "HANDLE_CONTRAST_CHANGE") {
        return {
            ...state,
            contrastSliderValue: action.payload
        };
    }

    if (action.type === "HANDLE_BLUR_CHANGE") {
        return {
            ...state,
            blurSliderValue: action.payload
        };
    }

    if (action.type === "HANDLE_SATURATE_CHANGE") {
        return {
            ...state,
            saturateSliderValue: action.payload
        };
    }

    if (action.type === "HANDLE_RETURN_DEFAULT_BUTTON") {
        return {
            ...state,
            brightnessSliderValue: 50,
            contrastSliderValue: 50,
            blurSliderValue: 0,
            saturateSliderValue: 50
        };
    }

    if (action.type === "SHOW_CROP_CANVAS") {
        if (state.image) {
            return {
                ...state,
                showCropCanvas: !action.payload,
                showSlider: false,
                showTextField: false,
                showResizeSection: false,
                showRotateSection: false,
                errorMessage: ""
            };
        } else {
            return {
                ...state,
                errorMessage: "Please upload an image!",
                showSlider: false,
                showRotateSection: false,
                showResizeSection: false,
                showTextField: false
            };
        }
    }

    if (action.type === "SHOW_TEXT_FIELD") {
        console.log("SHOW_TEXT_FIELD: ");
        return {
            ...state,
            showTextField: !action.payload,
            showSlider: false,
            showCropCanvas: false,
            showRotateSection: false,
            showResizeSection: false,
            errorMessage: ""
        };
    }

    if (action.type === "HANDLE_TEXT_CHANGE") {
        console.log("text input: " + action.payload);
        return {
            ...state,
            textInput: action.payload
        };
    }

    if (action.type === "HANDLE_COLOR_CHANGE") {
        return {
            ...state,
            inputColor: action.payload
        };
    }

    if (action.type === "HANDLE_TEXT_SIZE_CHANGE") {
        return {
            ...state,
            textSize: action.payload
        };
    }

    if (action.type === "HANDLE_DOWNLOAD_IMAGE") {
        return {
            ...state,
            imgURLFlag: true
        };
    }

    if (action.type === "SET_IMG_URL") {
        return {
            ...state,
            imgURL: action.payload
        };
    }

    if (action.type === "DOWNLOAD_IMAGE") {
        var link = document.createElement("a");
        let fileName = state.imageName.split(".")[0];

        link.download = fileName + "-Editted" + ".jpg";

        link.href = state.imgURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        link.remove();

        return {
            ...state,
            imgURLFlag: false
        };
    }

    if (action.type === "HANDLE_SCALE_CHANGE") {
        console.log("HANDLE_SCALE_CHANGE: " + Math.round(action.payload));
        return {
            ...state,
            scaleValue: Math.round(action.payload)
        };
    }

    if (action.type === "SHOW_ROTATE_SECTION") {
        return {
            ...state,
            showRotateSection: !action.payload,
            showCropCanvas: false,
            showTextField: false,
            showResizeSection: false,
            showSlider: false,
            errorMessage: "",
            fineTuneRotate: 0
        };
    }

    if (action.type === "TOGGLE_HORIZONTAL_FLIP") {
        console.log(
            "TOGGLE_HORIZONTAL_FLIP horizontalFlip: " + state.horizontalFlip
        );
        return {
            ...state,
            horizontalFlip: !action.payload
        };
    }

    if (action.type === "TOGGLE_VERTICAL_FLIP") {
        console.log("TOGGLE_VERTICAL_FLIP");
        return {
            ...state,
            verticalFlip: !action.payload
        };
    }

    if (action.type === "ROTATE_90_DEGREE_LEFT") {
        console.log("action.payload: " + action.payload);
        return {
            ...state,
            rotateCanvas: -90
        };
    }

    if (action.type === "ROTATE_90_DEGREE_RIGHT") {
        console.log("action.payload: " + action.payload);
        return {
            ...state,
            rotateCanvas: 90
        };
    }

    if (action.type === "RESET_ROTATE") {
        return {
            ...state,
            rotateCanvas: 0,
            fineTuneRotate: 0
        };
    }

    if (action.type === "HANDLE_FINE_TUNE_ROTATE") {
        console.log("Value: " + action.payload);
        return {
            ...state,
            fineTuneRotate: state.inactValue - action.payload,
            inactValue: action.payload
        };
    }

    if (action.type === "SET_WIDTH_AND_HEIGHT_OF_CANVAS_DIV") {
        console.log("action.payload.height: " + action.payload.height);
        console.log("action.payload.width: " + action.payload.width);
        return {
            ...state,
            canvasDivHeight: action.payload.height,
            canvasDivWidth: action.payload.width
        };
    }

    if (action.type === "SET_RESIZE_REGION_CLICKED") {
        return {
            ...state,
            cropDivClickedResizeRegion: action.payload
        };
    }

    if (action.type === "SET_CROP_DIV_INITIAL_COOR") {
        return {
            ...state,
            cropDivClickInitialX: action.payload.x,
            cropDivClickInitialY: action.payload.y
        };
    }

    if (action.type === "SET_CROP_DIV_SIZE") {
        if (action.payload.region) {
            return {
                ...state,
                cropDivWidth: state.cropDivWidth + action.payload.width,
                cropDivHeight: state.cropDivHeight + action.payload.height,
                cropDivClickedResizeRegion: false
            };
        }
    }

    if (action.type === "SET_CROP_DIV_LEFT_AND_TOP") {
        return {
            ...state,
            cropDivTop: state.cropDivTop + action.payload.top,
            cropDivLeft: state.cropDivLeft + action.payload.left
        };
    }

    if (action.type === "SET_CROP_DIV_LEFT_AND_TOP_PLAIN") {
        return {
            ...state,
            cropDivTop: action.payload.top,
            cropDivLeft: action.payload.left
        };
    }

    if (action.type === "CROP_IMAGE") {
        return {
            ...state,
            cropImage: !action.payload
        };
    }

    return state;
};

export default UploadImageReducer;
