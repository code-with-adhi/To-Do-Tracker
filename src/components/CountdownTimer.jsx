// src/components/CountdownTimer.jsx

import React, { useState, useEffect } from "react";

function CountdownTimer({ deadline }) {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    if (!deadline) {
      return;
    }

    const calculateTimeLeft = () => {
      const difference = +new Date(deadline) - +new Date();
      let timeLeft = {};

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      } else {
        timeLeft = {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }

      return timeLeft;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  const timerComponents = [];
  const isDeadlinePassed = Object.values(timeLeft).every((val) => val <= 0);

  if (isDeadlinePassed && deadline) {
    return <span className="deadline-passed">Deadline passed!</span>;
  }

  Object.keys(timeLeft).forEach((interval) => {
    if (
      timeLeft[interval] > 0 ||
      (interval === "seconds" && timeLeft.seconds >= 0)
    ) {
      timerComponents.push(
        <span key={interval} className="timer-item">
          {timeLeft[interval]} {interval}{" "}
        </span>
      );
    }
  });

  return (
    <div className="countdown-timer">
      {timerComponents.length ? timerComponents : null}
    </div>
  );
}

export default CountdownTimer;
