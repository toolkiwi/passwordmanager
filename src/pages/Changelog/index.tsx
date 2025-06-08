import { ChangelogInterface } from '@/interfaces/ChangelogInterface';
import { useEffect, useState } from 'react';
import '@/styles/changelog.css';
import dayjs from 'dayjs';
import { TbHeartFilled } from 'react-icons/tb';
import { LuClock } from 'react-icons/lu';
import CommonUtils from '@/utils/commonUtils';
import RenderArticles from './__partials/RenderArticles';
import Loading from '@/components/Loading';
import RenderGoBack from './__partials/RenderGoBack';
import RenderLinks from './__partials/RenderLinks';
import useOnlineStatus from '@/hooks/useOnlineStatus';
import Alert from '@/components/Alert';

export default function ChangelogPage() {
    /**
     * States contains all articles
     */
    const [articles, setArticles] =
        useState<ChangelogInterface.API.Article[]>();
    /**
     * Instance useOnlineStatus hook to track the current online status of the user
     */
    const isUserOnline = useOnlineStatus();
    /**
     * Retrieves last articles from endpoint
     */
    async function getArticlesFromAPI() {
        const response = await fetch(import.meta.env.VITE_CHANGELOG_API);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        setArticles(json);
    }
    /**
     * Update the document title
     */
    CommonUtils.DocumentTitle('Changelog');

    useEffect(() => {
        getArticlesFromAPI();
    }, []);

    return (
        <div className={CN.page_wrapper} id='changelog-container'>
            <div className={CN.page_background} />
            <div className={CN.page_content}>
                <RenderGoBack />
                <div className={CN.header}>
                    <h1 className={CN.header_title}>Changelog</h1>
                    {articles && (
                        <h1 className={CN.header_sub}>
                            <LuClock size={20} />
                            Last update{' '}
                            {dayjs(articles[0].created_at).format(
                                'DD MMM YYYY',
                            )}
                        </h1>
                    )}
                    <RenderLinks />
                    {!isUserOnline && (
                        <Alert
                            type='ERROR'
                            text='You are not connected to the internet. Please check your connection and try again.'
                        />
                    )}
                </div>
                {articles ? (
                    <RenderArticles articles={articles} />
                ) : (
                    <div className='pt-20'>
                        <Loading />
                    </div>
                )}
            </div>
            {articles && (
                <div className={CN.footer}>
                    <div className={CN.footer_text}>
                        Made with{' '}
                        <span className={CN.footer_text_span}>
                            <TbHeartFilled size={15} />
                        </span>{' '}
                        by ToolKiwi
                    </div>
                    <div className={CN.footer_mail}>contact@toolkiwi.com</div>
                </div>
            )}
        </div>
    );
}

const CN = {
    page_wrapper: 'h-screen overflow-auto max-sm:p-2',
    page_background:
        'bg-changelog absolute top-0 left-0 w-full h-full opacity-1 -z-10',
    page_content: 'max-w-[650px] m-auto relative',
    header: 'flex flex-col gap-4 pt-10',
    header_title: 'font-bold text-5xl text-white text-center max-sm:text-4xl',
    header_sub:
        'font-semibold text-xl text-neutral-600 flex flex-row items-center gap-2 justify-center max-sm:text-lg',
    footer: 'text-center py-5 uppercase text-sm opacity-50 hover:opacity-100 group transition-all',
    footer_text: 'flex items-center justify-center',
    footer_mail: 'text-xs text-neutral-500 p-2',
    footer_text_span: 'text-red-600 mx-2 group-hover:scale-130 transition-all',
    goback: 'inline-flex flex-row items-center py-4 px-5 -ml-5 my-3 rounded-full hover:bg-neutral-800/35 cursor-pointer select-none',
    goback_text: 'text-lg text-white font-semibold ml-3',
};
