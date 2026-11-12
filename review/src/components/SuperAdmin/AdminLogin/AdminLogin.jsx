// import React from "react";
// import styles from "./adminlogin.module.scss";
// import reviewLogo from "../../../assets/review-logo.svg";
// import polygon from "../../../assets/Polygon 2.svg";
// import eyeOpen from "../../../assets/eye-open.svg";
// import eyeClose from "../../../assets/eye-close.svg";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Button from "../../ui/Button";
// import { postLoginAPICallFunction } from "../../Reactquery/ReactQuery";
// import { useMutation } from "@tanstack/react-query";
// import useStore from "../../../store/store";
// import { adminLoginApi } from "../../Api/udsApi";

// export default function AdminLogin() {
//   const navigate = useNavigate();
//   const setToken = useStore((state) => state.setToken);
//   const setIsLogin = useStore((state) => state.setIsLogin);
//   const setUser = useStore((state) => state.setUser);

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });
//   w;
//   const loginMutation = useMutation({
//     mutationFn: async () => {
//       // setIsLoading(true);
//       const response = await postLoginAPICallFunction({
//         url: adminLoginApi,
//         data: { formValue: form },
//       });

//       return response;
//     },
//     onSuccess: (data) => {
//       console.log(data, "Daslkjdkjaldkask");
//       if (data.data.status.code === 200) {
//         setToken(data.data.session.token);
//         localStorage.setItem("udsToken", data.data.session.token);

//         setUser(data.data.data);
//         setIsLogin(true);
//         navigate("/");
//         toast.success(data.data.status.message);
//       }
//     },
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const nextErrors = {};
//     const emailValue = form.email.trim();

//     if (!emailValue) {
//       nextErrors.email = "Please enter your email.";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
//       nextErrors.email = "Please enter a valid email address.";
//     }

//     if (!form.password.trim()) {
//       nextErrors.password = "Please enter your password.";
//     } else if (form.password.trim().length < 8) {
//       nextErrors.password = "Password must be at least 8 characters.";
//     }

//     if (Object.keys(nextErrors).length > 0) {
//       setErrors(nextErrors);
//       toast.error("Please fix the highlighted fields.");
//       return;
//     }
//     loginMutation.mutate();
//   };

//   return (
//     <div className={styles.loginPage}>
//       <section className={styles.loginHero}>
//         <div className={styles.brand}>
//           <img
//             className={styles.brandMark}
//             src={polygon}
//             alt=""
//             aria-hidden="true"
//           />
//           <span className={styles.brandText}>UDS</span>
//         </div>
//         <h1>Feedback Hub</h1>
//         <p>
//           Log in to the Super Admin panel to monitor and control user feedback
//           across the system.
//         </p>
//       </section>

//       <section className={styles.loginCard} aria-label="Login form">
//         <div className={styles.cardIcon}>
//           <img src={reviewLogo} alt="UDS Review" />
//         </div>
//         <p className={styles.cardCopy}>
//           Enter your login details in the below.
//         </p>
//         <form className={styles.loginForm} onSubmit={handleSubmit}>
//           <label className={styles.field}>
//             <span>
//               Email <span className={styles.requiredStar}>*</span>
//             </span>
//             <input
//               name="email"
//               type="email"
//               placeholder="Enter Email"
//               value={form.email}
//               onChange={handleChange}
//               className={errors.email ? styles.inputError : ""}
//               required
//             />
//             {errors.email && (
//               <span className={styles.errorText}>{errors.email}</span>
//             )}
//           </label>
//           <label className={styles.field}>
//             <span>
//               Password <span className={styles.requiredStar}>*</span>
//             </span>
//             <div className={styles.passwordField}>
//               <input
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter Password"
//                 value={form.password}
//                 onChange={handleChange}
//                 className={errors.password ? styles.inputError : ""}
//                 required
//               />
//               <button
//                 type="button"
//                 className={styles.togglePassword}
//                 onClick={() => setShowPassword((prev) => !prev)}
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//               >
//                 <img
//                   src={showPassword ? eyeClose : eyeOpen}
//                   alt=""
//                   aria-hidden="true"
//                 />
//               </button>
//             </div>
//             {errors.password && (
//               <span className={styles.errorText}>{errors.password}</span>
//             )}
//           </label>
//           <Button
//             type="submit"
//             variant="primary"
//             size="md"
//             className={styles.loginButton}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? "Signing in..." : "Log in"}
//           </Button>
//         </form>
//       </section>
//     </div>
//   );
// }

import React from "react";
import styles from "./adminlogin.module.scss";
import reviewLogo from "../../../assets/review-logo.svg";
import polygon from "../../../assets/Polygon 2.svg";
import eyeOpen from "../../../assets/eye-open.svg";
import eyeClose from "../../../assets/eye-close.svg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../../ui/Button";
import { postLoginAPICallFunction } from "../../Reactquery/ReactQuery";
import { useMutation } from "@tanstack/react-query";
import useStore from "../../../store/store";
import { adminLoginApi } from "../../Api/udsApi";
import axios, { isAxiosError } from "axios";

export default function AdminLogin() {
  const navigate = useNavigate();

  const setToken = useStore((state) => state.setToken);
  const setIsLogin = useStore((state) => state.setIsLogin);
  const setUser = useStore((state) => state.setUser);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    try {
      setIsSubmitting(true);

      const response = await fetch(adminLoginApi, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.status?.message || "Login Failed");
      }

      //success

      if (data.status.code === 200) {
        setToken(data.session.token);
        localStorage.setItem("udsToken", data.session.token);

        setUser(data.data);
        setIsLogin(true);

        toast.success(data.status.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = {};
    const emailValue = form.email.trim();

    if (!emailValue) {
      nextErrors.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!form.password.trim()) {
      nextErrors.password = "Please enter your password.";
    } else if (form.password.trim().length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    handleLogin();
  };

  // return (
  //   <div className={styles.loginPage}>
  //     <ToastContainer />

  //     <section className={styles.loginCard}>
  //       <form className={styles.loginForm}>
  //         <input
  //           name="email"
  //           type="email"
  //           value={form.email}
  //           onChange={handleChange}
  //         />

  //         <input
  //           name="pasword"
  //           type={showPassword ? "text" : "password"}
  //           value={form.password}
  //           onChange={handleChange}
  //         />

  //         <Button type="submit" disabled={isSubmitting}>
  //           {isSubmitting ? "Signing in " : "Log In"}
  //         </Button>
  //       </form>
  //     </section>
  //   </div>
  // );
  return (
    <div className={styles.loginPage}>
      <section className={styles.loginHero}>
        <div className={styles.brand}>
          <img
            className={styles.brandMark}
            src={polygon}
            alt=""
            aria-hidden="true"
          />
          <span className={styles.brandText}>UDS</span>
        </div>
        <h1>Feedback Hub</h1>
        <p>
          Log in to the Super Admin panel to monitor and control user feedback
          across the system.
        </p>
      </section>

      <section className={styles.loginCard} aria-label="Login form">
        <div className={styles.cardIcon}>
          <img src={reviewLogo} alt="UDS Review" />
        </div>
        <p className={styles.cardCopy}>
          Enter your login details in the below.
        </p>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>
              Email <span className={styles.requiredStar}>*</span>
            </span>
            <input
              name="email"
              type="email"
              placeholder="Enter Email"
              value={form.email}
              onChange={handleChange}
              className={error.email ? styles.inputError : ""}
              required
            />
            {error.email && (
              <span className={styles.errorText}>{error.email}</span>
            )}
          </label>
          <label className={styles.field}>
            <span>
              Password <span className={styles.requiredStar}>*</span>
            </span>
            <div className={styles.passwordField}>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={form.password}
                onChange={handleChange}
                className={error.password ? styles.inputError : ""}
                required
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <img
                  src={showPassword ? eyeClose : eyeOpen}
                  alt=""
                  aria-hidden="true"
                />
              </button>
            </div>
            {error.password && (
              <span className={styles.errorText}>{error.password}</span>
            )}
          </label>
          <Button
            type="submit"
            variant="primary"
            size="md"
            className={styles.loginButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Log in"}
          </Button>
        </form>
      </section>
    </div>
  );
}
