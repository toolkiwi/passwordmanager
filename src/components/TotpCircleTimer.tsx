import { ReactElement, useMemo } from 'react';
import cslx, { clsx } from 'clsx';

/**
 * Props interface for the TOTP Circle Timer component
 */
interface TotpCircleTimerProps {
    /** Remaining time in seconds until next code generation */
    remaining: number;
    /** Total period duration in seconds */
    period: number;
    /** Size of the timer circle in pixels */
    size?: number;
    /** Optional CSS class name for custom styling */
    className?: string;
    /** Whether to show the remaining seconds text */
    showText?: boolean;
    /** Warning threshold as percentage of period  */
    warningThreshold?: number;
}

/**
 * A circular progress timer for TOTP (Time-based One-Time Password) codes.
 * Displays a visual countdown with color indication for time remaining.
 *
 * @param remaining - Time remaining in seconds
 * @param period - Total period duration in seconds
 * @param size - Circle diameter in pixels (default: 32)
 * @param className - Additional CSS classes
 * @param showText - Whether to display remaining seconds (default: true)
 * @param warningThreshold - Warning color threshold as percentage (default: 0.16)
 */
export default function TotpCircleTimer({
    remaining,
    period,
    size = 32,
    className,
    showText = true,
    warningThreshold = 0.16,
}: TotpCircleTimerProps): ReactElement {
    /**
     * Memoized calculations for circle properties and styling
     */
    const circleProps = useMemo(() => {
        /**
         * Ensure valid inputs
         */
        const safeRemaining = Math.max(0, Math.min(remaining, period));
        const safePeriod = Math.max(1, period);

        /**
         * Circle geometry calculations
         */
        const strokeWidth = Math.max(2.5, size * 0.0625);
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;

        /**
         * Progress calculations
         */
        const progress = safeRemaining / safePeriod;
        const strokeDashoffset = circumference * (1 - progress);

        /**
         * Determine warning and critical states based on thresholds
         */
        const warningSeconds = Math.max(8, safePeriod * warningThreshold);
        const isWarning = safeRemaining <= warningSeconds;
        const isCritical = safeRemaining <= Math.max(5, safePeriod * 0.05);

        return {
            radius,
            circumference,
            strokeWidth,
            strokeDashoffset,
            isWarning,
            isCritical,
            progress,
            center: size / 2,
        };
    }, [remaining, period, size, warningThreshold]);

    /**
     * Dynamic color classes based on time remaining
     */
    const progressColor = useMemo(() => {
        if (circleProps.isCritical) return 'text-red-600 dark:text-red-400';
        if (circleProps.isWarning) return 'text-orange-500 dark:text-orange-400';
        return 'text-green-500 dark:text-green-400';
    }, [remaining, circleProps.isWarning, circleProps.isCritical]);

    /**
     * Responsive text size based on circle size
     */
    const textSize = useMemo(() => {
        if (size <= 24) return 'text-[8px]';
        if (size <= 32) return 'text-[10px]';
        if (size <= 40) return 'text-xs';
        return 'text-sm';
    }, [size]);

    return (
        <div
            className={cslx('relative inline-flex items-center justify-center flex-shrink-0', className)}
            style={{ width: size, height: size }}
            role='progressbar'
            aria-valuenow={remaining}
            aria-valuemin={0}
            aria-valuemax={period}
            aria-label={`TOTP code expires in ${remaining} seconds`}
            title={`Time remaining: ${remaining}s`}
        >
            {/* SVG Circle Timer */}
            <svg
                className='transform -rotate-90 absolute inset-0'
                viewBox={`0 0 ${size} ${size}`}
                width={size}
                height={size}
                aria-hidden='true'
            >
                {/* Background circle */}
                <circle
                    cx={circleProps.center}
                    cy={circleProps.center}
                    r={circleProps.radius}
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={circleProps.strokeWidth}
                    className='text-muted/50'
                />

                {/* Progress circle */}
                <circle
                    cx={circleProps.center}
                    cy={circleProps.center}
                    r={circleProps.radius}
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={circleProps.strokeWidth}
                    strokeDasharray={circleProps.circumference}
                    strokeDashoffset={circleProps.strokeDashoffset}
                    strokeLinecap='round'
                    className={clsx('transition-all duration-1000 ease-linear', progressColor)}
                />
            </svg>

            {/* Remaining time text */}
            {showText && (
                <span
                    className={cslx('absolute font-medium tabular-nums select-none', textSize, progressColor)}
                    aria-hidden='true'
                >
                    {remaining}
                </span>
            )}
        </div>
    );
}

/**
 * Export types for external use
 */
export type { TotpCircleTimerProps };
