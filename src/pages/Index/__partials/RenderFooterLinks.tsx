import StyledButton from '@/components/styled/StyledButton';
import TK_WB_WHITE from '@/assets/tk_xs.png';
import { FaGithub } from 'react-icons/fa6';

export default function RenderFooterLinks() {
    return (
        <div className={CN.container}>
            <a href='https://github.com/toolkiwi/passwordmanager' target='_blank' rel='noreferrer'>
                <StyledButton
                    button={{
                        className: CN.button,
                    }}
                >
                    <FaGithub size={18} className={CN.button_github} />
                </StyledButton>
            </a>
            <a href={import.meta.env.VITE_TOOLKIWI_URL} target='_blank' rel='noreferrer'>
                <StyledButton
                    button={{
                        className: CN.button,
                    }}
                >
                    <img src={TK_WB_WHITE} width={18} height={18} className={CN.button_toolkiwi} />
                </StyledButton>
            </a>
        </div>
    );
}

const CN = {
    container: 'pt-5 flex flex-row items-center gap-2',
    button: 'p-2.5 flex flex-row items-center group',
    button_github: 'transition-all group-hover:text-white',
    button_toolkiwi: 'grayscale-100 opacity-30 transition-all group-hover:grayscale-0 group-hover:opacity-100',
};
