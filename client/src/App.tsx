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
import SurveyPreview from "./components/survey_preview/SurveyPreview";
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/authportal" element={<SignIn />} />
          <Route path="/survey/:surveyId" element={<SurveyPreview />} />
        </Route>

        {/* Private Routes */}
        <Route element={<PrivateLayout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/survey/:workspaceId/:surveyId/build/*"
            element={<SurveyBuilder />}
          />
        </Route>

        {/* Catch-All Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
