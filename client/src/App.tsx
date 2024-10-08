import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  PublicLayout,
  PrivateLayout,
  Home,
  SignIn,
  NotFound,
  SurveyBuilder,
} from "./components";
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/authportal" element={<SignIn />} />
        </Route>

        {/* Private Routes */}
        <Route element={<PrivateLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/survey/:workspaceId/:surveyId/build" element={<SurveyBuilder />} />
        </Route>

        {/* Catch-All Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
