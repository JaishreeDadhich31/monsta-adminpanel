import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./assets/css/style.css";
import "./assets/css/responsive.css";
import QuizAdmin from "./components/QuizAdmin";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QuizAdmin />
  </BrowserRouter>,
);
