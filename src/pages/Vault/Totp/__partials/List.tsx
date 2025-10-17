import { ReactElement, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useVirtualizer } from '@tanstack/react-virtual';

import type { VaultInterface } from '@/interfaces/VaultInterface';
import type { StoreState } from '@/redux/StoreRedux';

import CopyAction from '@/components/CopyAction';
import EmptyList from '@/components/list/EmptyList';
import RenderTOTPBadge from '@/components/RenderTOTPBadge';
import SmartFavicon from '@/components/SmartFavicon';
import TotpTimer from '@/components/TotpCircleTimer';

import useIsMobile from '@/hooks/useIsMobile';
import TotpUtils from '@/utils/totpUtils';
import ListCN from '@/styles/CN/ListCN';
import FormCN from '@/styles/CN/FormCN';

/**
 * Interface for component props
 */
interface PropsComponent {
    data: VaultInterface.Password[] | null | undefined;
}

/**
 * TOTP Codes List Component
 * ----------------------------------
 * Displays a virtualized list of passwords with TOTP codes
 * Auto-updates TOTP codes and remaining time every second
 */
export default function List({ data }: PropsComponent): ReactElement {
    /**
     * Get tags from vault state data
     */
    const Tags = useSelector((state: StoreState) => state.vault._d?.tags);

    /**
     * TOTP codes state - stores generated codes for each password
     */
    const [totpCodes, setTotpCodes] = useState<Record<string, string>>({});

    /**
     * Remaining time state - stores countdown for each TOTP code
     */
    const [remainingTimes, setRemainingTimes] = useState<Record<string, number>>({});

    const navigate = useNavigate();
    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const parentRef = useRef<HTMLDivElement>(null);

    /**
     * Virtual scrolling configuration for performance with large lists
     */
    const rowVirtualizer = useVirtualizer({
        count: data?.length ?? 0,
        getScrollElement: () => parentRef.current,
        estimateSize: () => (isMobile ? 85 : 100),
        gap: isMobile ? 10 : 15,
        overscan: 5,
    });

    /**
     * Renders a small colored badge on the password element if it has an associated tag
     */
    const RenderPasswordTag = ({ password }: { password: VaultInterface.Password }): ReactElement | undefined => {
        if (!Tags || !password.tag_id) return;

        const Tag = Tags[Tags.findIndex((i) => i.id === password.tag_id)];

        return (
            <button
                type='button'
                className={CN.tag_wrapper}
                data-tooltip-content={Tag.title}
                data-tooltip-delay-show={150}
                data-tooltip-offset={3}
                data-tooltip-id='default-tooltip'
            >
                <div className={CN.tag} style={{ backgroundColor: Tag.color }} />
            </button>
        );
    };

    /**
     * Generates TOTP codes for all passwords with TOTP configuration
     */
    const generateTotpCodes = async (): Promise<void> => {
        if (!data) return;

        const codes: Record<string, string> = {};

        for (const item of data) {
            if (item.totp) {
                try {
                    codes[item.id] = await TotpUtils.GenerateTOTP(item.totp);
                } catch {
                    codes[item.id] = '------';
                }
            }
        }

        setTotpCodes(codes);
    };

    /**
     * Updates remaining time for all TOTP codes and triggers regeneration when needed
     */
    const updateTimers = (): void => {
        if (!data) return;

        const times: Record<string, number> = {};

        for (const item of data) {
            if (item.totp) {
                const period = item.totp.period || 30;
                const remaining = TotpUtils.GetRemainingSeconds(period);
                times[item.id] = remaining;
                /**
                 * Regenerate TOTP code when the timer hits zero
                 */
                if (remaining === period) {
                    generateTotpCodes();
                }
            }
        }

        setRemainingTimes(times);
    };

    /**
     * Formats TOTP code with space separator for better readability
     */
    const formatTotpCode = (code: string): string => {
        return (code || '000000').replace(/(.{3})/g, '$1 ').trim();
    };

    /**
     * Handles navigation to password details
     */
    const handlePasswordClick = (passwordId: string): void => {
        navigate(`/vault/passwords/${passwordId}`);
    };

    /**
     * Re-measure row sizes when mobile state changes
     */
    useEffect(() => {
        rowVirtualizer.measure();
    }, [isMobile, rowVirtualizer]);

    /**
     * Initialize TOTP generation and timer updates
     */
    useEffect(() => {
        if (!data) return;

        /**
         * Initial setup
         */
        generateTotpCodes();
        updateTimers();
        /**
         * Set up interval to update timers every second
         */
        const interval = setInterval(updateTimers, 1000);

        return () => clearInterval(interval);
    }, [data]);

    /**
     * Show empty state when no data
     */
    if (!data || data.length === 0) {
        return <EmptyList title={t('common:password_not_found')} />;
    }

    return (
        <div className={ListCN.container}>
            <div ref={parentRef} className={ListCN.wrapper}>
                <div className={ListCN.rows_virtualizer} style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const item = data[virtualRow.index];
                        const itemPeriod = item.totp?.period || 30;
                        const itemRemaining = remainingTimes[item.id] || itemPeriod;

                        return (
                            <div
                                role='button'
                                key={virtualRow.key}
                                ref={rowVirtualizer.measureElement}
                                className={ListCN.list_item}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                                data-index={item.id}
                                onClick={() => handlePasswordClick(item.id)}
                            >
                                <div className={ListCN.list_item_content}>
                                    <div className={FormCN.favicon_container}>
                                        <SmartFavicon url={item.url} title={item.title} className={FormCN.favicon} />
                                        {item.totp && <RenderTOTPBadge />}
                                        <RenderPasswordTag password={item} />
                                    </div>

                                    <div className={ListCN.text_container}>
                                        <div className={CN.item_title}>
                                            {item.title}
                                            {item.login ? ` - ${item.login}` : ''}
                                        </div>
                                        <div className={CN.code_container}>
                                            <div className={CN.totp_code}>{formatTotpCode(totpCodes[item.id])}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className={ListCN.actions} onClick={(e) => e.stopPropagation()}>
                                    <CopyAction value={totpCodes[item.id] || ''} tooltip={t('common:copy_password')} />
                                    {item.totp && <TotpTimer remaining={itemRemaining} period={itemPeriod} size={32} />}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

const CN = {
    tag_wrapper: 'absolute -bottom-0.5 -right-0.5',
    tag: 'w-4 h-4 rounded-full border-3 border-black transition-all hover:scale-120',
    item_title: 'text-sm text-foreground/30 font-semibold truncate',
    code_container: 'flex items-center',
    totp_code: 'font-bold text-2xl text-foreground',
};
