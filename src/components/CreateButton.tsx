import { useNavigate } from 'react-router';
import StyledButton from '@/components/styled/StyledButton';

interface PropsComponent {
    to: string;
    label: string;
}

/**
 * Create button shown in the page head, always visible top-right
 */
export default function CreateButton({ to, label }: PropsComponent) {
    /**
     * Instance of useNavigate hook
     */
    const navigate = useNavigate();

    return (
        <StyledButton variant='secondary' button={{ className: CN.button, onClick: () => navigate(to) }}>
            {label}
        </StyledButton>
    );
}

const CN = {
    button: 'p-3 text-sm flex items-center gap-1.5 whitespace-nowrap',
};
