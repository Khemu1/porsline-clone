import { StrictMode, Suspense } from "react"; // Ensure React is imported
import { createRoot } from "react-dom/client";
import App from "./App";
import "./App.css";
import store from "./store/store";
import { Provider } from "react-redux";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
      <Suspense fallback={<div>Loading...</div>}>
        <Provider store={store}>
          <App />
        </Provider>
      </Suspense>
    </StrictMode>
  );
}
