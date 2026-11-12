import React, { use, useEffect, useMemo, useState } from "react";
import styles from "./review.module.scss";
import background from "../../../assets/background.svg";
import reviewLogo from "../../../assets/review-logo.svg";
import logout from "../../../assets/user-logout.svg";
import userLogo from "../../../assets/user.svg";
import rafiki from "../../../assets/rafiki.svg";
import Button from "../../ui/Button";
import StarRating from "../../ui/StarRating";
import baseRatings from "../../../data/reviewRatings.json";
import Navbar from "../Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  clientQuestionListGetApi,
  userFeedbackSubmitApi,
} from "../../Api/udsApi";
import {
  getNoTokenAPICallFunction,
  noTokenPostAPICallFunction,
  postAPICallFunction,
} from "../../Reactquery/ReactQuery";
import useStore from "../../../store/store";
import { toast } from "react-toastify";

export default function Review() {
  const { clientId } = useParams();
  const feedbackUser = useStore((state) => state.feedbackUser);
  const setFeedbackUser = useStore((state) => state.setFeedbackUser);
  const setIsLoading = useStore((state) => state.setIsLoading);
  const loadRatings = () => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return { ...baseRatings, ...JSON.parse(stored) };
      }
    } catch (err) {
      return baseRatings;
    }
    return baseRatings;
  };
  const [ratings, setRatings] = useState(loadRatings);
  const [isReviewLocked, setIsReviewLocked] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answerData, setAnswerData] = useState([]);
  const [errors, setErrors] = useState({ remarks: false });
  const navigate = useNavigate();

  const {
    data: clientQuestionsData,
    refetch: clientQuestionsDataRefetch,
    isFetching: clientQuestionsDataIsFetching,
  } = useQuery({
    queryKey: ["clientQuestionsData", clientId],
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

  const averageRating = useMemo(() => {
    const ratingValues = answerData.map((item) => item.ratings);
    console.log(ratingValues, "Asdkajdajdajk");
    const values = Object.values(answerData.map((item) => item.ratings));
    console.log(values, "kjdajksdkjajk");
    const sum = values.reduce((acc, val) => acc + Number(val || 0), 0);
    return (sum / values.length).toFixed(1);
  }, [answerData]);

  const ratingRows = [
    { key: "quality", label: "Quality of food" },
    { key: "variety", label: "Menu Variety" },
    { key: "friendliness", label: "Friendliness of Staff" },
    { key: "promptness", label: "Promptness of Service" },
    { key: "cleanliness", label: "Cleanliness & Hygiene" },
    { key: "overall", label: "Overall Experience" },
  ];

  const storageKey = "reviewRatings";

  const updateRating = (key, value) => {
    console.log(key, "asdjkaskjdkjsad", value);
    // setRatings((prev) => {
    //   const next = { ...prev, [key]: value };
    //   localStorage.setItem(storageKey, JSON.stringify(next));
    //   return next;
    // });

    setAnswerData((prev) => {
      const next = prev.map((item) => {
        if (item.question_id === key?.question_id) {
          return { ...item, ratings: value };
        }
        return item;
      });
      return next;
    });
  };

  useEffect(() => {
    if (clientQuestionsData?.data?.questions) {
      const updatedData = clientQuestionsData.data.questions.map((q) => ({
        question: q.name,
        question_id: q._id,
        description: q.description,

        ratings: 0,
      }));

      setAnswerData(updatedData);
    }
  }, [clientQuestionsData]);

  console.log(answerData, "daksdklalkdkla");

  const userFeedbackSubmitMutation = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      const response = await noTokenPostAPICallFunction({
        url: userFeedbackSubmitApi,
        data: {
          ...feedbackUser,
          category_id: clientQuestionsData.data.questions[0].category_id,
          remarks: remarks,
          response: answerData,
        },
      });

      if (response.data.status.code == 201) {
        toast.success(response.data.status.message);
        setIsSubmitted(true);

        clientQuestionsDataRefetch();
      }
      setIsLoading(false);
      return response;
    },
  });

  const handleSubmit = () => {
    if (!isReviewLocked) {
      const trimmedRemarks = remarks.trim();
      if (!trimmedRemarks) {
        setErrors((prev) => ({ ...prev, remarks: true }));
        return;
      }
      setErrors((prev) => ({ ...prev, remarks: false }));
      setIsReviewLocked(true);
      return;
    } else {
      userFeedbackSubmitMutation.mutate();
    }
  };

  const handleRemarksChange = (event) => {
    const value = event.target.value;
    setRemarks(value);
    if (errors.remarks && value.trim()) {
      setErrors((prev) => ({ ...prev, remarks: false }));
    }
  };

  const handleCloseSubmission = () => {
    navigate(`/feedback/${clientId}`);
    setFeedbackUser(null);
  };

  return (
    <div
      className={styles.reviewPage}
      style={{ backgroundImage: `url(${background})` }}
    >
      <section
        className={`${styles.reviewCard} ${
          !isReviewLocked && !isSubmitted ? styles.editMode : ""
        } ${isSubmitted ? styles.submittedMode : ""}`}
        aria-label="Review feedback"
        style={{
          height:
            isReviewLocked && isSubmitted
              ? "auto"
              : isReviewLocked
                ? "90%"
                : "90%",
        }}
      >
        {console.log(
          isReviewLocked,
          isSubmitted,

          "kjsdhsahdhkada",
        )}
        {!isReviewLocked && !isSubmitted ? (
          <>
            <div className={styles.cardHeader}>
              <h2>Rate Your Experience</h2>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.ratingHeader}>
                <span>Description</span>
                <span>Ratings</span>
              </div>

              <div className={styles.editList}>
                {answerData.map((row) => (
                  <div key={row.key} className={styles.editRow}>
                    <div className={styles.editMeta}>
                      <span className={styles.editTitle}>{row.question}</span>
                      <span className={styles.editHint}>{row.description}</span>
                    </div>
                    <StarRating
                      value={row.ratings}
                      onChange={(value) => updateRating(row, value)}
                      label={`${row.label} rating`}
                      className={styles.starGroup}
                    />
                  </div>
                ))}
              </div>

              <div className={styles.remark}>
                <span>
                  Remark / Comments{" "}
                  <span className={styles.requiredStar}>*</span>
                </span>
                <textarea
                  className={`${styles.remarkBox} ${
                    errors.remarks ? styles.remarkBoxError : ""
                  }`}
                  value={remarks}
                  placeholder="Enter your Remarks"
                  onChange={handleRemarksChange}
                  rows={4}
                />
                {errors.remarks ? (
                  <p className={styles.remarkError}>Please enter review</p>
                ) : null}
              </div>
            </div>
            <div className={styles.cardActionsSingle}>
              <Button variant="primary" size="sm" onClick={handleSubmit}>
                Review & Submit
              </Button>
            </div>
          </>
        ) : isReviewLocked && !isSubmitted ? (
          <>
            <div className={styles.cardHeader}>
              <h2>Review Your feedback</h2>
            </div>
            <div className={styles.cardBody}>
              <p className={styles.cardIntro}>
                Please review your responses before submitting
              </p>
              <div className={styles.overallRow}>
                <span>Overall Average Rating</span>
                <span className={styles.overallValue}>{averageRating}</span>
                <StarRating
                  value={Number(averageRating)}
                  readOnly
                  label="Overall rating"
                  className={styles.starGroup}
                />
              </div>

              <div className={styles.ratingList}>
                {answerData.map((row) => (
                  <div key={row.key} className={styles.ratingRow}>
                    <span>{row.question}</span>
                    <StarRating
                      value={row.ratings}
                      readOnly
                      label={`${row.label} rating`}
                      className={styles.starGroup}
                    />
                  </div>
                ))}
              </div>

              <div
                className={styles.comments}
                style={{ overflowY: "auto", height: "130px" }}
              >
                <h3>Remark / Comments</h3>
                <p>{remarks}</p>
              </div>
            </div>
            <div className={styles.cardActions}>
              <Button
                variant="ghost"
                size="sm"
                className={styles.editButton}
                onClick={() => setIsReviewLocked(false)}
              >
                Edit Feedback
              </Button>
              <Button variant="primary" size="sm" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.cardHeader}>
              <h2>Thank you for submission</h2>
              <button
                type="button"
                className={styles.submissionClose}
                onClick={handleCloseSubmission}
                aria-label="Close"
              >
                X
              </button>
            </div>
            <div className={styles.cardBody}>
              <p className={styles.cardIntro}>
                Your feedback has been submitted successfully. We appreciate
                your time and input.
              </p>
              <div className={styles.submissionArt} aria-hidden="true">
                <img src={rafiki} alt="" />
              </div>
              <div className={styles.cardActionsSingle}>
                <Button
                  variant="primary"
                  size="sm"
                  className={styles.submissionButton}
                  onClick={handleCloseSubmission}
                >
                  Close
                </Button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
