"use client"

import React from "react";
import { useState, useEffect } from "react";

const Progress = ({ total, supplied }: { total: number; supplied: number }) => {
  const [percentage, setPercentage] = useState(0);

  console.log("IAM FROM pup", total, supplied);

  useEffect(() => {
    const calculatePercentage = () => {
      if (total === 0) return 0;
      return (supplied / total) * 100;
    };
    setPercentage(calculatePercentage());
  }, [total, supplied]);

  return (
    <div className="w-[20rem] md:w-full border border-gray-500 bg-gray-200 rounded-lg h-2 mt-2 overflow-hidden">
      <div className="h-full flex">
        <div
          className="bg-yellow-500 h-full"
          style={{ width: `${percentage}%` }}
        ></div>
        <div
          className="bg-green-500 h-full"
          style={{ width: `${100 - percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Progress;