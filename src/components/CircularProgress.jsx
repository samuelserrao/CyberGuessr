import { motion } from 'framer-motion';

export default function CircularProgress({ 
  percentage, 
  size = 120, 
  strokeWidth = 10, 
  color = '#06b6d4', // cyber-cyan
  title, 
  subtitle 
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
      <div className="relative" style={{ width: size, height: size }}>
        {/* SVG Circle Track */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-white/5 fill-transparent"
            strokeWidth={strokeWidth}
          />
          {/* Animated SVG Circle Filler */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="fill-transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 6px ${color})`,
            }}
          />
        </svg>
        
        {/* Central percentage text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-cyber font-bold text-xl text-white">
            {percentage}%
          </span>
          {subtitle && (
            <span className="text-[9px] uppercase tracking-wider text-gray-500 font-cyber">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {title && (
        <h4 className="mt-3.5 font-rajdhani font-bold text-base text-gray-300 tracking-wider">
          {title}
        </h4>
      )}
    </div>
  );
}
