interface ProgressBarProps {
  size: number;
  progress: number;
  trackWidth: number;
  trackColor: string;
  indicatorWidth: number;
  indicatorColor: string;
  indicatorCap: 'inherit' | 'butt' | 'round' | 'square' | undefined;
  label: string;
  labelColor: string;
  spinnerMode: boolean;
  spinnerSpeed: number;
}

const ProgressBar = ({
  size,
  progress,
  trackWidth,
  trackColor,
  indicatorWidth,
  indicatorColor,
  indicatorCap,
  labelColor,
  spinnerMode,
  spinnerSpeed,
}: ProgressBarProps) => {
  const center = size / 2,
    radius = center - (trackWidth > indicatorWidth ? trackWidth : indicatorWidth),
    dashArray = 2 * Math.PI * radius,
    dashOffset = dashArray * ((100 - progress * 10) / 100);
  return (
    <div>
      <div className='relative' style={{ width: size, height: size }}>
        <svg className='rotate-[-90deg]' style={{ width: size, height: size }}>
          <circle
            className='svg-pi-track'
            cx={center}
            cy={center}
            fill='transparent'
            r={radius}
            stroke={trackColor}
            strokeWidth={trackWidth}
          />
          <circle
            className={`svg-pi-indicator ${spinnerMode ? 'svg-pi-indicator--spinner' : ''}`}
            style={{ animationDuration: `${spinnerSpeed * 1000}ms` }}
            cx={center}
            cy={center}
            fill='transparent'
            r={radius}
            stroke={indicatorColor}
            strokeWidth={indicatorWidth}
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            strokeLinecap={indicatorCap}
          />
        </svg>
        <div
          className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center'
          style={{ color: labelColor }}
        >
          <span className='block text-xl font-semibold text-[#5B5B5B]'>
            {progress < 10 && 0}
            {progress.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
