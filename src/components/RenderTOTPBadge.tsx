/**
 * Renders a badge indicating TOTP (Time-based One-Time Password) functionality
 */
export default function RenderTOTPBadge() {
    return (
        <div className={CN.wrapper}>
            <div className={CN.content}>TOTP</div>
        </div>
    );
}

const CN = {
    wrapper: 'absolute bottom-1 left-1',
    content: 'px-1 py-0.5 text-[6px] uppercase bg-foreground/10 rounded-sm font-bold text-foreground backdrop-blur-lg',
};
