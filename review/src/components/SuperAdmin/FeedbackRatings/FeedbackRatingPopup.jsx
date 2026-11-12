import React from "react";
import styles from "./FeedBackPopup.module.scss";
import StarRating from "../../ui/StarRating";

const defaultFeedback = {
  name: "F David John",
  date: "02/02/2026, 2:00 pm",
  overall: 4.8,
  items: [
    {
      label: "Quality of food",
      question: "How would you rate the overall quality of our service?",
      rating: 4.8,
    },
    {
      label: "Menu Variety",
      question: "How would you rate the overall quality of our service?",
      rating: 5,
    },
    {
      label: "Friendliness of Staff",
      question: "How would you rate the overall quality of our service?",
      rating: 5,
    },
    {
      label: "Promptness of Service",
      question: "How would you rate the overall quality of our service?",
      rating: 5,
    },
    {
      label: "Cleanliness & Hygiene",
      question: "How would you rate the overall quality of our service?",
      rating: 5,
    },
    {
      label: "Overall Experience",
      question: "How would you rate the overall quality of our service?",
      rating: 5,
    },

    {
      label: "Overall Experience",
      question: "How would you rate the overall quality of our service?",
      rating: 5,
    },
    {
      label: "Overall Experience",
      question: "How would you rate the overall quality of our service?",
      rating: 5,
    },
    {
      label: "Overall Experience",
      question: "How would you rate the overall quality of our service?",
      rating: 5,
    },
  ],
  remark:
    "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled.",
};
const FeedbackRatingPopup = ({
  open = false,
  onClose,
  feedback = defaultFeedback,
}) => {
  const { name, date, overall, items, remark } = feedback;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <h3>Feedback ratings</h3>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close feedback details"
          >
            ×
          </button>
        </div>
        <div className={styles.ratingwrapper}>
          <div className={styles.summaryCard}>
            <div>
              <strong>{name}</strong>
              <span>{date}</span>
            </div>
            <div className={styles.summaryRating}>
              <StarRating
                value={Math.round(overall)}
                readOnly
                className={styles.starGroup}
                label="Overall rating"
              />
              <span className={styles.overallValue}>{overall.toFixed(1)}</span>
            </div>
          </div>

          <div className={styles.ratingList}>
            {items.map((item) => (
              <div key={item.label} className={styles.ratingRow}>
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.question}</span>
                </div>
                <div className={styles.ratingScore}>
                  <span>{item.rating}/5</span>
                  <StarRating
                    value={Math.round(item.rating)}
                    readOnly
                    className={styles.starGroup}
                    // label={${item.label} rating}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className={styles.comments}>
            <h4>Remark / Comments</h4>
            <p>{remark}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackRatingPopup;
