import { FC } from 'react';

const IconMinus = ({ className, fill = false, duotone = true }) => {
    return (
        <svg width="16" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    );
};

export default IconMinus;
