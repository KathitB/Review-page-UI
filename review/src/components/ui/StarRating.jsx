import React, { useMemo, useState } from "react";
import { FaStar } from "react-icons/fa";
import styles from "./star-rating.module.scss";

const colors = {
  orange: "#F2C265",
  grey: "#a9a9a9",
};

export default function StarRating({
  value = 0,
  max = 5,
  size = 20,
  onChange,
  readOnly = false,
  className = "",
  label = "Rating",
}) {
  const [hoverValue, setHoverValue] = useState(undefined);
  const stars = useMemo(() => Array(max).fill(0), [max]);

  const handleMouseOverStar = (starValue) => {
    if (!readOnly) {
      setHoverValue(starValue);
    }
  };

  const handleMouseLeaveStar = () => {
    if (!readOnly) {
      setHoverValue(undefined);
    }
  };

  const handleClickStar = (starValue) => {
    if (!readOnly) {
      onChange?.(starValue);
    }
  };

  return (
    <div
      className={[styles.wrapper, className].filter(Boolean).join(" ")}
      role="radiogroup"
      aria-label={label}
    >
      {stars.map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={starValue}
            type="button"
            className={styles.starButton}
            style={{ width: size, height: size }}
            aria-checked={starValue === value}
            role="radio"
            disabled={readOnly}
            onMouseOver={() => handleMouseOverStar(starValue)}
            onMouseLeave={handleMouseLeaveStar}
            onClick={() => handleClickStar(starValue)}
          >
            <FaStar
              size={size}
              color={
                (hoverValue || value) > index ? colors.orange : colors.grey
              }
            />
          </button>
        );
      })}
    </div>
  );
}
