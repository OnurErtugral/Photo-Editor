import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";

import App from "./App";
import UploadImageReducer from "./reducers/UploadImageReducer";

const loggerMiddleware = createLogger();

ReactDOM.render(
    <Provider
        store={createStore(
            UploadImageReducer,
            applyMiddleware(thunkMiddleware)
        )}
    >
        <App />
    </Provider>,
    document.getElementById("root")
);
