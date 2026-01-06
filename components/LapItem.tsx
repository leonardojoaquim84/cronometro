
import React from 'react';
import { Lap } from '../types';
import { formatTime } from '../utils/timeFormatter';

interface LapItemProps {
  lap: Lap;
  isFastest: boolean;
  isSlowest: boolean;
}

const LapItem: React.FC<LapItemProps> = ({ lap, isFastest, isSlowest }) => {
  const { minutes, seconds, milliseconds } = formatTime(lap.time);
  const overall = formatTime(lap.overallTime);

  let textColor = "text-black/70";
  if (isFastest) textColor = "text-emerald-700 font-bold";
  if (isSlowest) textColor = "text-red-700 font-bold";

  return (
    <div className="flex items-center justify-between py-4 border-b border-black/10 last:border-0 group">
      <div className="flex items-center gap-4">
        <span className="text-black/40 font-medium mono text-sm">#{lap.id.toString().padStart(2, '0')}</span>
        <span className={`font-medium mono text-lg ${textColor}`}>
          {minutes}:{seconds}.{milliseconds}
        </span>
      </div>
      <div className="text-right">
        <div className="text-black/40 text-[10px] uppercase tracking-wider mb-1">Total</div>
        <div className="text-black/80 mono text-sm">
          {overall.hours !== '00' && `${overall.hours}:`}{overall.minutes}:{overall.seconds}.{overall.milliseconds}
        </div>
      </div>
    </div>
  );
};

export default LapItem;
