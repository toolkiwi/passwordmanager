import { FaGithub, FaMastodon, FaTrello, FaXTwitter } from 'react-icons/fa6';
import { ReactElement } from 'react';

/**
 * Represents a social media link with an icon and a URL
 * @typedef {Object} SocialLink
 * @property {ReactElement} icon
 * @property {string} link
 */
type SocialLink = {
    icon: ReactElement;
    title: string;
    link: string;
};

/**
 * Render a list of external social media links with icons
 * @returns {ReactElement}
 */
export default function RenderLinks(): ReactElement {
    /**
     * Array with all socials links
     */
    const links: SocialLink[] = [
        {
            icon: <FaGithub />,
            title: 'GitHub Repository (Open Source)',
            link: 'https://github.com/toolkiwi/passwordmanager-web',
        },
        {
            icon: <FaTrello />,
            title: 'Follow the project on Trello!',
            link: 'https://trello.com/b/WZc2CZZ8/password-manager',
        },
        {
            icon: <FaXTwitter />,
            title: 'Follow us on X!',
            link: 'https://x.com/ToolKiwi',
        },
        {
            icon: <FaMastodon />,
            title: 'Follow us on Mastodon!',
            link: 'https://mastodon.social/@toolkiwi',
        },
    ];
    /**
     * Render JSX
     */
    return (
        <div>
            <ul className={CN.list}>
                {links.map((item, index) => (
                    <li
                        key={index}
                        className='cursor-pointer'
                        data-tooltip-id='default-tooltip'
                        data-tooltip-place='bottom'
                        data-tooltip-content={item.title}
                        data-tooltip-delay-show={250}
                    >
                        <a
                            href={item.link}
                            target='_blank'
                            rel='noreferrer'
                            className={CN.item_a}
                        >
                            {item.icon}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const CN = {
    list: 'flex items-center justify-center flex-row gap-3',
    item_a: 'p-3 block relative rounded-lg text-2xl border border-neutral-800 opacity-50 transition-all hover:opacity-100 hover:bg-neutral-900',
};
