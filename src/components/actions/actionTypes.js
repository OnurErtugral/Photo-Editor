// NAVBAR ACTIONS
export function handleUploadedFile(e) {
    return {
        type: "HANDLE_FILE_UPLOAD",
        payload: e
    };
}

export function handleShowResizeModal(e) {
    return {
        type: "SHOW_RESIZE_MODAL"
    };
}

export function handleCloseResizeModal(e) {
    return {
        type: "CLOSE_MODAL"
    };
}

export function handleShowSlider(showSlider) {
    return {
        type: "SHOW_SLIDER",
        payload: showSlider
    };
}

export function handleShowCropCanvas(showCropCanvas) {
    return {
        type: "SHOW_CROP_CANVAS",
        payload: showCropCanvas
    };
}

export function handleShowTextField(showTextField) {
    return {
        type: "SHOW_TEXT_FIELD",
        payload: showTextField
    };
}

// TEXT INPUT ACTIONS
export function handleTextChange(e) {
    return {
        type: "HANDLE_TEXT_CHANGE",
        payload: e.target.value
    };
}
export function handleChangeComplete(e) {
    return {
        type: "HANDLE_COLOR_CHANGE",
        payload: e.hex
    };
}
export function handleTextSizeChange(event, value) {
    return {
        type: "HANDLE_TEXT_SIZE_CHANGE",
        payload: value
    };
}
