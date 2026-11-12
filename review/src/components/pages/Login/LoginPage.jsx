import React from "react";
import styles from "./login.module.scss";
import reviewLogo from "../../../assets/review-logo.svg";
import polygon from "../../../assets/Polygon 2.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../../ui/Button";
import { getNoTokenAPICallFunction } from "../../Reactquery/ReactQuery";
import { clientQuestionListGetApi } from "../../Api/udsApi";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Loader/Loader";
import useStore from "../../../store/store";

export default function LoginPage() {
  const { clientId } = useParams();
  console.log(clientId, "ajsdkajjkdajkdkja");
  const navigate = useNavigate();
  const setFeedbackUser = useStore((state) => state.setFeedbackUser);
  const feedbackUser = useStore((state) => state.feedbackUser);

  const [form, setForm] = useState({
    username: "",
    email: "",
    mobile_number: "",
  });

  const {
    data: clientActiveQuestionsData,
    refetch: clientActiveQuestionsDataRefetch,
    isFetching: clientActiveQuestionsDataIsFetching,
  } = useQuery({
    queryKey: ["clientActiveQuestionsData", clientId],
    queryFn: async () => {
      const response = await getNoTokenAPICallFunction({
        url: clientQuestionListGetApi,
        id: clientId,
      });
      if (response.status.code == 200) {
      }
      return response;
    },
    enabled: clientId !== undefined,
  });
  console.log(clientActiveQuestionsData, "asdasdasdasd");

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow only numbers & max 10 digits for phone
    if (name === "mobile_number") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setForm((prev) => ({
        ...prev,
        mobile_number: digitsOnly,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = {};
    const phoneValue = form.mobile_number || "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.username?.trim()) {
      nextErrors.username = "Please enter your name.";
    }

    if (!form.email?.trim()) {
      nextErrors.email = "Please enter your email.";
    } else if (!emailRegex.test(form.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!phoneValue) {
      nextErrors.mobile_number = "Please enter your mobile number.";
    } else if (phoneValue.length !== 10) {
      nextErrors.mobile_number = "Mobile number must be 10 digits.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setIsSubmitting(true);
    setFeedbackUser(form);
    toast.success("Login successful.");
    navigate(`/review/${clientId}`, { replace: true });
  };

  return (
    <>
      {clientActiveQuestionsDataIsFetching && <Loader />}
      {clientActiveQuestionsData?.data?.client !== "inactive" ? (
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
            <p>Log in to view, manage, and respond to user feedback.</p>
          </section>

          <section className={styles.loginCard} aria-label="Login form">
            <div className={styles.cardIcon}>
              <img src={reviewLogo} alt="UDS Review" />
            </div>
            <p className={styles.cardCopy}>
              Your feedback helps us improve our food quality, service and
              overall experience
            </p>
            <form className={styles.loginForm} onSubmit={handleSubmit}>
              <label className={styles.field}>
                <span>
                  Your Name <span className={styles.requiredStar}>*</span>
                </span>
                <input
                  name="username"
                  type="text"
                  placeholder="Enter the Name"
                  value={form.username}
                  onChange={handleChange}
                  className={errors.username ? styles.inputError : ""}
                />
                {errors.username && (
                  <span className={styles.errorText}>{errors.username}</span>
                )}
              </label>
              <label className={styles.field}>
                <span>
                  Email <span className={styles.requiredStar}>*</span>
                </span>
                <input
                  name="email"
                  type="text"
                  placeholder="Enter the Email"
                  value={form.email}
                  onChange={handleChange}
                  className={errors.email ? styles.inputError : ""}
                />
                {errors.email && (
                  <span className={styles.errorText}>{errors.email}</span>
                )}
              </label>
              <label className={styles.field}>
                <span>
                  Mobile No <span className={styles.requiredStar}>*</span>
                </span>
                <input
                  name="mobile_number"
                  type="tel"
                  placeholder="Enter Phone number"
                  value={form.mobile_number}
                  onChange={handleChange}
                  className={errors.mobile_number ? styles.inputError : ""}
                />
                {errors.mobile_number && (
                  <span className={styles.errorText}>
                    {errors.mobile_number}
                  </span>
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
      ) : (
        <div className={styles.inActiveClientCard}>
          <section
            className={styles.cardContainer}
            aria-label="Inactive client message"
          >
            <h3 className={styles.title}>Client Inactive</h3>
            <p className={styles.message}>
              The client is inactive. Please contact the admin.
            </p>
          </section>
        </div>
      )}
    </>
  );
}
