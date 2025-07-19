import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider, message } from "antd";
import store from "./redux/store";
import { Provider } from "react-redux";

// Make antd message available globally for axios interceptor
window.antd = { message };

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: "#305139",
            colorPrimaryHover: "#305139",
            borderRadius: "2px",
            boxShadow: "none",
          },
        },
        token: {
          borderRadius: "2px",
          colorPrimary: "#305139",
        },
      }}
    >
      <App />
    </ConfigProvider>
  </Provider>
);


reportWebVitals();
