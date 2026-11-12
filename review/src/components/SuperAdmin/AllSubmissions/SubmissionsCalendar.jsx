import React, { useMemo, useRef, useState } from "react";
import styles from "./SubmissionsCalendar.module.scss";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const VIEW_MODES = [
  { key: "days", label: "Days" },
  { key: "month", label: "Month" },
  { key: "year", label: "Year" },
];

const padDay = (value) => String(value).padStart(2, "0");

const clampDateToMonth = (year, monthIndex, day) => {
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  return new Date(year, monthIndex, Math.min(day, lastDay));
};

export default function SubmissionsCalendar({
  initialDate = new Date(2026, 1, 3),
  onChange,
}) {
  const [viewMode, setViewMode] = useState("days");
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [anchorDate, setAnchorDate] = useState(initialDate);
  const scrollRef = useRef(null);

  const headerLabel = useMemo(() => {
    return `CALENDER - ${padDay(selectedDate.getDate())} ${MONTH_NAMES[
      selectedDate.getMonth()
    ].toUpperCase()} ${selectedDate.getFullYear()}`;
  }, [selectedDate]);

  const visibleItems = useMemo(() => {
    if (viewMode === "days") {
      const year = anchorDate.getFullYear();
      const month = anchorDate.getMonth();
      const totalDays = new Date(year, month + 1, 0).getDate();

      return Array.from({ length: totalDays }, (_, index) => {
        const date = new Date(year, month, index + 1);
        return {
          id: `${year}-${month}-${index + 1}`,
          label: padDay(index + 1),
          subLabel: WEEKDAY_SHORT[date.getDay()],
          isActive:
            selectedDate.getFullYear() === year &&
            selectedDate.getMonth() === month &&
            selectedDate.getDate() === index + 1,
          onSelect: () => {
            const nextDate = new Date(year, month, index + 1);
            setSelectedDate(nextDate);
            onChange?.(nextDate, "days");
          },
        };
      });
    }

    if (viewMode === "month") {
      const selectedYear = anchorDate.getFullYear();
      return MONTH_NAMES.map((monthName, monthIndex) => ({
        id: `${selectedYear}-${monthIndex}`,
        label: monthName.slice(0, 3),
        subLabel: String(selectedYear),
        isActive:
          selectedDate.getFullYear() === selectedYear &&
          selectedDate.getMonth() === monthIndex,
        onSelect: () => {
          const nextDate = clampDateToMonth(
            selectedYear,
            monthIndex,
            selectedDate.getDate(),
          );
          setSelectedDate(nextDate);
          onChange?.(nextDate, "month");
        },
      }));
    }

    const startYear = anchorDate.getFullYear() - 6;
    return Array.from({ length: 12 }, (_, index) => {
      const yearValue = startYear + index;
      return {
        id: String(yearValue),
        label: String(yearValue),
        subLabel: "Year",
        isActive: selectedDate.getFullYear() === yearValue,
        onSelect: () => {
          const nextDate = clampDateToMonth(
            yearValue,
            selectedDate.getMonth(),
            selectedDate.getDate(),
          );
          setSelectedDate(nextDate);
          onChange?.(nextDate, "year");
        },
      };
    });
  }, [anchorDate, onChange, selectedDate, viewMode]);

  const shiftWindow = (direction) => {
    if (viewMode === "days") {
      const nextMonth = new Date(
        anchorDate.getFullYear(),
        anchorDate.getMonth() + direction,
        1,
      );
      setAnchorDate(nextMonth);
      return;
    }

    if (viewMode === "month") {
      setAnchorDate(
        new Date(anchorDate.getFullYear() + direction, anchorDate.getMonth(), 1),
      );
      return;
    }

    setAnchorDate(new Date(anchorDate.getFullYear() + direction * 12, 0, 1));
  };

  const handleModeChange = (nextMode) => {
    setViewMode(nextMode);
  };

  const scrollByCards = (direction) => {
    if (!scrollRef.current) {
      return;
    }

    scrollRef.current.scrollBy({
      left: direction * 250,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.calendarCard}>
      <div className={styles.topRow}>
        <h3>{headerLabel}</h3>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.arrowButton}
            onClick={() => {
              shiftWindow(-1);
              scrollByCards(-1);
            }}
            aria-label="Previous"
          >
            &#9664;
          </button>

          <div className={styles.modeSwitch} role="tablist" aria-label="Calendar mode">
            {VIEW_MODES.map((mode) => (
              <button
                key={mode.key}
                type="button"
                className={`${styles.modeButton} ${
                  viewMode === mode.key ? styles.modeButtonActive : ""
                }`}
                onClick={() => handleModeChange(mode.key)}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className={styles.arrowButton}
            onClick={() => {
              shiftWindow(1);
              scrollByCards(1);
            }}
            aria-label="Next"
          >
            &#9654;
          </button>
        </div>
      </div>

      <div className={styles.itemsRow} ref={scrollRef}>
        {visibleItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${styles.itemCard} ${item.isActive ? styles.itemCardActive : ""}`}
            onClick={item.onSelect}
          >
            <span className={styles.itemLabel}>{item.label}</span>
            <span className={styles.itemSubLabel}>{item.subLabel}</span>
            <span className={styles.itemDivider} />
          </button>
        ))}
      </div>
    </div>
  );
}
