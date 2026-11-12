import React, { useState } from "react";
import styles from "./DashBoardContent.module.scss";
import tileBg from "../../../assets/tile-background.svg";
import tileOne from "../../../assets/tile-1.svg";
import tileTwo from "../../../assets/tile-2.svg";
import tileThree from "../../../assets/tile-3.svg";
import arrowIcon from "../../../assets/right-arrow.svg";
import StarRating from "../../ui/StarRating";
import Slider from "@mui/material/Slider";
import FeedbackRatingPopup from "../FeedbackRatings/FeedbackRatingPopup";
import { getAPICallFunction } from "../../Reactquery/ReactQuery";
import { dashboardGetApi } from "../../Api/udsApi";
import { useQuery } from "@tanstack/react-query";
import useStore from "../../../store/store";
import { FaSpinner } from "react-icons/fa";
import { Spin } from "antd";




export default function DashBoardContent() {
  const [feedBackOpen, setFeedbackOpen] = useState(false);
  const selectedClient = useStore((state) => state.selectedClient);
 

   const {
    data: dashboardData,
    refetch: dashboardDataRefetch,
    isFetching: dashboardDataIsFetching,
  } = useQuery({
    queryKey: ["dashboardData",selectedClient],
    queryFn: async () => {
      const response = await getAPICallFunction({
        url: dashboardGetApi,
        params: {
          client: selectedClient?.value,
         
        },
      });
      if (response.status.code == 200) {
       
     
      }
      return response;
    },
    enabled: !!selectedClient,
  });

   const statTiles = [
    {
      label: "My Active Questions",
      value: dashboardData?.data?.activeQuestionsCount,
      icon: tileOne,
    },
    {
      label: "Total Submissions",
      value: dashboardData?.data?.totalSubmissions,
      icon: tileTwo,
    },
    {
      label: "Average Rating",
      value: dashboardData?.data?.overallAvgRating,
      icon: tileThree,
    },
  ];
  console.log(dashboardData?.data?.ratingOverview?.rateCount?.["4"],"dashboardData")

  const ratingRows = [
    { score: 5, count: "1,985 Ratings", value: dashboardData?.data?.ratingOverview?.rateCount?.["5"]},
    { score: 4, count: "365 Ratings", value:
      dashboardData?.data?.ratingOverview?.rateCount?.["4"]},
    { score: 3, count: "130 Ratings", value: 
      dashboardData?.data?.ratingOverview?.rateCount?.["3"]
     },
    { score: 2, count: "90 Ratings", value: 
      dashboardData?.data?.ratingOverview?.rateCount?.["2"]
     },
    { score: 1, count: "33 Ratings", value: 
      dashboardData?.data?.ratingOverview?.rateCount?.["1"]
     },
  ];

  const recentSubmissions = [
    { name: "F David John", date: "02/02/2026, 2:00 pm", rating: 4 },
    { name: "K Kenziya Mol", date: "02/02/2026, 2:00 pm", rating: 4 },
    { name: "D Sanjay Kumar", date: "02/02/2026, 2:05 pm", rating: 4 },
    { name: "G Gowthamy", date: "02/02/2026, 2:10 pm", rating: 4 },
    { name: "G Kavin kumar", date: "02/02/2026, 2:25 pm", rating: 4 },
    { name: "J Jenisha", date: "02/02/2026, 2:30 pm", rating: 4 },
    { name: "J Jenisha", date: "02/02/2026, 2:30 pm", rating: 4 },
    { name: "J Jenisha", date: "02/02/2026, 2:30 pm", rating: 4 },
    { name: "J Jenisha", date: "02/02/2026, 2:30 pm", rating: 4 },
    { name: "J Jenisha", date: "02/02/2026, 2:30 pm", rating: 4 },
    { name: "J Jenisha", date: "02/02/2026, 2:30 pm", rating: 4 },
    { name: "J Jenisha", date: "02/02/2026, 2:30 pm", rating: 4 },
    { name: "J Jenisha", date: "02/02/2026, 2:30 pm", rating: 4 },
  ];
  let value = 3.3;
  let max = 5;
  const arcLength = 157;
  const percentage = Math.min(value / max, 1);
  const dashOffset = arcLength * (1 - percentage);

  return (
    <div className={styles.content}>
      <div className={styles.leftColumn}>
        <div className={styles.tileGrid}>
          {statTiles.map((tile) => (
            <div
              key={tile.label}
              className={styles.statTile}
              style={{
                backgroundImage: `url(${tileBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className={styles.tileContent}>
                <span className={styles.tileLabel}>{tile.label}</span>
                <span className={styles.tileValue}>{dashboardDataIsFetching? <Spin />:
                  tile.value}</span>
              </div>
              <div className={styles.tileIcon}>
                <img src={tile.icon} alt="" aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>

        <div className={styles.ratingsCard}>
          <div className={styles.cardHeader}>
            <h3>Ratings by Question</h3>
            <p>Average rating for each feedback point</p>
          </div>
          <div className={styles.ratingOverview}>
            <div>
              <h4>Rating Overview</h4>
              <span>Totally {dashboardData?.data?.ratingOverview?.totalRatingsCount} Ratings</span>
            </div>
            <div className={styles.gaugeWrap}>
              <svg
                viewBox="0 0 120 80"
                className={styles.gauge}
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id="gaugeGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#ED4C28" />
                    <stop offset="100%" stopColor="#FDBF20" />
                  </linearGradient>
                </defs>

                {/* Background arc */}
                <path
                  d="M10 70 A50 50 0 0 1 110 70"
                  fill="none"
                  stroke="#e4e7eb"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Value arc */}
                <path
                  d="M10 70 A50 50 0 0 1 110 70"
                  fill="none"
                  stroke="url(#gaugeGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={arcLength}
                  strokeDashoffset={dashOffset}
                  style={{ transition: "stroke-dashoffset 0.6s ease" }}
                />

                {/* Value text */}
                <text
                  x="60"
                  y="55"
                  textAnchor="middle"
                  className={styles.gaugeValue}
                >
                  { dashboardData?.data?.ratingOverview?.averageRating}
                </text>

                <text
                  x="60"
                  y="72"
                  textAnchor="middle"
                  className={styles.gaugeLabel}
                >
                  /{max} Ratings
                </text>
              </svg>
            </div>
          </div>
          
          <div className={styles.ratingBars}>
            {ratingRows.map((row) => (
              <div key={row.score} className={styles.ratingRow}>
                <span className={styles.scoreValue}>{row.score}</span>
                <StarRating
                  value={1}
                  max={1}
                  readOnly
                  size={25}
                  className={styles.starSmall}
                />

{console.log(dashboardData?.data?.ratingOverview?.totalRatingsCount,"aksdlkadkaskdasdas")}

                <Slider
                  value={row.value}
                  valueLabelDisplay="off"
                  min={0}
                  max={dashboardData?.data?.ratingOverview?.totalRatingsCount}
                  sx={{
                    height: 10,
                    padding: 0,

                    // Yellow filled part
                    "& .MuiSlider-track": {
                      backgroundColor: "#fdbf20",
                      border: "none",
                    },

                    // Gray background
                    "& .MuiSlider-rail": {
                      backgroundColor: "#f8f8f8",
                      opacity: 1,
                    },

                    // Remove circle thumb
                    "& .MuiSlider-thumb": {
                      display: "none",
                    },
                  }}
                />

                <span className={styles.barCount}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.rightColumn}>
        <div className={styles.submissionCard}>
          <div className={styles.submissionHeader}>
            <div>
              <h3>Recent Submissions</h3>
              <p>Latest feedback from users</p>
            </div>
            <button type="button" className={styles.viewAll}>
              View all
            </button>
          </div>
          <div className={styles.submissionList}>
            {recentSubmissions.map((item) => (
              <div
                key={item.name}
                className={styles.submissionItem}
                onClick={() => {
                  setFeedbackOpen(true);
                }}
              >
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.date}</span>
                </div>
                <div className={styles.submissionMeta}>
                  <StarRating
                    value={3}
                    max={5}
                    readOnly
                    className={styles.starSmall}
                  />
                  <button type="button" className={styles.arrowButton}>
                    <img src={arrowIcon} alt="" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {feedBackOpen && (
            <FeedbackRatingPopup onClose={() => setFeedbackOpen(false)} />
          )}
        </div>
      </div>
    </div>
  );
}
