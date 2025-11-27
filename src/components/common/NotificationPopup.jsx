import React from 'react';
import { 
    Snackbar, 
    Alert, 
    Slide, 
    Fade,
    Grow 
} from '@mui/material';

const NotificationPopup = ({
    message,
    type = 'info', // success, error, warning, info
    isVisible = false,
    onClose,
    autoClose = true,
    duration = 3000,
    position = { vertical: 'top', horizontal: 'right' },
    transition = 'slide', // slide, fade, grow
    variant = 'filled' // filled, outlined, standard
}) => {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        if (onClose) {
            onClose();
        }
    };

    // Chọn transition component
    const getTransitionComponent = () => {
        switch (transition) {
            case 'fade':
                return Fade;
            case 'grow':
                return Grow;
            case 'slide':
            default:
                return Slide;
        }
    };

    const TransitionComponent = getTransitionComponent();

    // Props cho transition
    const getTransitionProps = () => {
        if (transition === 'slide') {
            return { direction: position.horizontal === 'right' ? 'left' : 'right' };
        }
        return {};
    };

    return (
        <Snackbar
            open={isVisible}
            autoHideDuration={autoClose ? duration : null}
            onClose={handleClose}
            anchorOrigin={position}
            TransitionComponent={TransitionComponent}
            TransitionProps={getTransitionProps()}
        >
            <Alert
                onClose={handleClose}
                severity={type}
                variant={variant}
                sx={{
                    width: '100%',
                    minWidth: '300px',
                    maxWidth: '500px',
                    fontSize: '14px',
                    '& .MuiAlert-message': {
                        padding: '8px 0'
                    }
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default NotificationPopup;
