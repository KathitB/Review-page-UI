import React from "react";
import { ShimmerTable } from "react-shimmer-effects";

const ShimmerTableLoader = ({ rows = 4 }) => {
  return <ShimmerTable row={rows} />;
};
export default ShimmerTableLoader;
