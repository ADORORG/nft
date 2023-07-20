"use client"
import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
    const calculateTimeRemaining = () => {
        const currentTime = new Date().getTime();
        const timeDifference = targetDate - currentTime;
    
        if (timeDifference > 0) {
          const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    
          return {
            hours: hours < 10 ? `0${hours}` : hours,
            minutes: minutes < 10 ? `0${minutes}` : minutes,
            seconds: seconds < 10 ? `0${seconds}` : seconds,
          };
        }
    
        // If the countdown is over, return all zeros
        return {
          hours: '00',
          minutes: '00',
          seconds: '00',
        };
    };
    const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

    useEffect(() => {
        const timer = setInterval(() => {
        setTimeRemaining(calculateTimeRemaining());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <span>{timeRemaining.hours}h </span>
            <span>{timeRemaining.minutes}m </span>
            <span>{timeRemaining.seconds}s</span>
        </>
    );
};

export default CountdownTimer;
