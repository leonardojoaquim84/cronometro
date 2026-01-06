
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

  let textColor = "text-neutral-400";
  if (isFastest) textColor = "text-emerald-400";
  if (isSlowest) textColor = "text-red-400";

  return (
    <div className="flex items-center justify-between py-4 border-b border-neutral-800 last:border-0 group">
      <div className="flex items-center gap-4">
        <span className="text-neutral-600 font-medium mono text-sm">#{lap.id.toString().padStart(2, '0')}</span>
        <span className={`font-medium mono text-lg ${textColor}`}>
          {minutes}:{seconds}.{milliseconds}
        </span>
      </div>
      <div className="text-right">
        <div className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Total</div>
        <div className="text-neutral-300 mono text-sm">
          {overall.hours !== '00' && `${overall.hours}:`}{overall.minutes}:{overall.seconds}.{overall.milliseconds}
        </div>
      </div>
    </div>
  );
};

export default LapItem;
