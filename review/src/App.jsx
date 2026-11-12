import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./components/pages/Login/LoginPage";
import Review from "./components/pages/Review/Review";
import Navbar from "./components/pages/Navbar";
import "./App.css";
import AdminLogin from "./components/SuperAdmin/AdminLogin/AdminLogin";
import Dasboard from "./components/SuperAdmin/DashBoard/DashBoard";
import FeedBackQuestions from "./components/SuperAdmin/FeedBackQuestions/FeedBackQuestions";
import UsersPage from "./components/SuperAdmin/Users/Users";
import UsersCategory from "./components/SuperAdmin/Users/UsersCategory";
import UsersCategoryQuestions from "./components/SuperAdmin/Users/UsersCategoryQuestions";
import useStore from "./store/store";
import PageAuth from "./components/PageAuth";
import Loader from "./components/Loader/Loader";
import AllSubmissions from "./components/SuperAdmin/AllSubmissions/AllSubmissions";
function App() {
  const isLogin = useStore((state) => state.isLogin);
  const isisLoading = useStore((state) => state.isLoading);
  const token = localStorage.getItem("udsToken");

  return (
    <div className="mainApp">
      {isisLoading && <Loader />}
      {isLogin && token ? (
        <>
          <Navbar />

          <Routes>
            <Route path="/" element={<PageAuth />} />
            <Route path="/dashboard" element={<Dasboard />} />
            <Route path="/feedback-questions" element={<FeedBackQuestions />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/allsubmissions" element={<AllSubmissions />} />

            <Route path="/category/:id" element={<UsersCategory />} />

            <Route
              path="/questions/:categoryId"
              element={<UsersCategoryQuestions />}
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<PageAuth />} />

          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/feedback/:clientId" element={<LoginPage />} />
          <Route path="/review/:clientId" element={<Review />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
