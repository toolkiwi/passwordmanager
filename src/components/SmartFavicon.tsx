import { useEffect, useState, useRef, ReactElement } from 'react';
import CommonUtils from '@/utils/commonUtils';

/**
 * Props for the SmartFavicon component.
 */
type SmartFaviconProps = {
    title: string;
    url: string;
    size?: number;
    className?: string;
};

/**
 * SmartFavicon component tries to load the favicon from a given URL
 * If it detects a generic 16x16 favicon, it falls back to a version based on the title only
 */
export default function SmartFavicon({
    title,
    url,
    size = 32,
    className,
}: SmartFaviconProps): ReactElement | null {
    const [src, setSrc] = useState<string | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);

    /**
     * Primary and fallback favicon URLs
     */
    const googleFavicon = CommonUtils.getWebsiteFavicon({ title, url });
    const fallbackSrc = CommonUtils.getWebsiteFavicon({ title });

    /**
     * Update favicon source on URL or size change
     */
    useEffect(() => {
        setSrc(googleFavicon);
    }, [url, size]);

    /**
     * Handle favicon load and check its dimensions.
     * If it's a generic 16x16 icon, fallback to alternative source.
     */
    function handleLoad(): void {
        const img = imgRef.current;
        if (!img) return;

        if (img.naturalWidth === 16 && img.naturalHeight === 16) {
            setSrc(fallbackSrc);
        }
    }

    /**
     * If favicon fails to load, fallback to title-based version.
     */
    function handleError(): void {
        setSrc(fallbackSrc);
    }

    /**
     * Do not render until src is defined
     */
    if (!src) return null;

    return (
        <img
            ref={imgRef}
            src={src}
            alt='favicon'
            width={size}
            height={size}
            onLoad={handleLoad}
            onError={handleError}
            className={className}
        />
    );
}
