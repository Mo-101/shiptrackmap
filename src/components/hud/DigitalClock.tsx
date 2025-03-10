
import React, { useState, useEffect } from 'react';

const DigitalClock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="font-mono text-sm">
      <span className="text-accent">{time.getUTCHours().toString().padStart(2, '0')}</span>
      <span className="text-white animate-pulse">:</span>
      <span className="text-accent">{time.getUTCMinutes().toString().padStart(2, '0')}</span>
      <span className="text-white animate-pulse">:</span>
      <span className="text-accent">{time.getUTCSeconds().toString().padStart(2, '0')}</span>
      <span className="text-white/60 ml-1">UTC</span>
    </div>
  );
};

export default DigitalClock;
