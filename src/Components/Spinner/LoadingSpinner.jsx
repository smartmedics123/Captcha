import React, { memo } from 'react';

const LoadingSpinner = memo(({ size = 30, color = "#003366" }) => {
    return (
        <div style={styles.spinnerContainer} className='mt-3'>
            <div 
                style={{
                    ...styles.spinner,
                    width: `${size}px`,
                    height: `${size}px`,
                    borderColor: `${color}20`,
                    borderTopColor: color
                }}
            />
        </div>
    );
});

// Inject CSS keyframes only once
if (typeof document !== 'undefined' && !document.querySelector('#spin-keyframes')) {
    const style = document.createElement('style');
    style.id = 'spin-keyframes';
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// Optimized styles for better performance
const styles = {
    spinnerContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    spinner: {
        border: '3px solid transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        willChange: 'transform', // GPU acceleration
        transform: 'translateZ(0)', // Force hardware acceleration
    }
};

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
