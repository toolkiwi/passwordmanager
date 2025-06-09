import { ChangelogInterface } from '@/interfaces/ChangelogInterface';
import dayjs from 'dayjs';
import Markdown from 'react-markdown';

export default function RenderArticles({
    articles,
}: {
    articles: ChangelogInterface.API.Article[];
}) {
    return (
        <section className={CN.section} id='articles'>
            {articles?.map((item, index) => {
                let localSection: string | null = null;
                return (
                    <div key={index} className={CN.article_wrapper}>
                        <div className={CN.version_badge}>
                            Version:{' '}
                            <span className={CN.version_text}>
                                {item.version_show}
                            </span>
                        </div>
                        <div className={CN.article_card}>
                            <div className={CN.article_header}>
                                <h1 className={CN.article_title}>
                                    {item.title}
                                </h1>
                                <div className={CN.article_date}>
                                    {dayjs(item.created_at).format(
                                        'DD MMM YYYY',
                                    )}
                                </div>
                            </div>
                            <div className={CN.article_markdown}>
                                <Markdown
                                    components={{
                                        h3({ ...props }) {
                                            const text = String(
                                                // eslint-disable-next-line react/prop-types
                                                props.children,
                                            ).toLowerCase();
                                            if (text.includes('added'))
                                                localSection =
                                                    'list-type-added';
                                            else if (text.includes('fixed'))
                                                localSection =
                                                    'list-type-fixed';
                                            else if (text.includes('changed'))
                                                localSection =
                                                    'list-type-changed';
                                            else if (text.includes('removed'))
                                                localSection =
                                                    'list-type-removed';
                                            else if (text.includes('note'))
                                                localSection = 'list-type-note';
                                            else localSection = null;

                                            return (
                                                <h3
                                                    {...props}
                                                    className={
                                                        localSection ?? ''
                                                    }
                                                />
                                            );
                                        },
                                        ul({ ...props }) {
                                            return (
                                                <ul
                                                    {...props}
                                                    className={
                                                        localSection ?? ''
                                                    }
                                                />
                                            );
                                        },
                                    }}
                                >
                                    {item.markdown}
                                </Markdown>
                            </div>
                        </div>
                        <div className={CN.article_footer}>
                            <div className={CN.article_footer_text}>
                                Published by
                            </div>
                            <div className={CN.article_footer_text}>
                                @{item.author.name}
                            </div>
                        </div>
                    </div>
                );
            })}
        </section>
    );
}

const CN = {
    section: 'mt-10',
    article_wrapper: 'mb-5 relative w-full',
    version_badge:
        'relative top-4 left-2 py-2 pb-5 px-5 bg-black rounded-lg border border-neutral-900 uppercase text-xs text-neutral-600 inline-block',
    version_text: 'text-neutral-400 font-semibold',
    article_card:
        'border border-neutral-800 overflow-hidden bg-neutral-900 rounded-lg relative',
    article_header:
        'px-8 py-5 flex items-center border-b border-neutral-800/50',
    article_title: 'text-2xl font-semibold flex-1 max-sm:text-xl',
    article_date: 'text-neutral-600 text-sm max-sm:text-xs',
    article_markdown: 'px-8 py-5 max-sm:text-sm',
    article_footer:
        'px-8 h-16 flex items-end pb-4 bg-black relative -top-4 rounded-lg -z-10 rounded border border-neutral-900 justify-between',
    article_footer_text: 'text-[10px] uppercase font-bold text-neutral-500',
    list_type_added: 'list-type-added',
    list_type_fixed: 'list-type-fixed',
    list_type_changed: 'list-type-changed',
    list_type_removed: 'list-type-removed',
    list_type_note: 'list-type-note',
};
