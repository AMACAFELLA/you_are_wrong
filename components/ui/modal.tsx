import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    const el = typeof document !== 'undefined' ? document.createElement('div') : null;

    useEffect(() => {
        if (el) {
            const modalRoot = document.getElementById('modal-root') as HTMLElement;
            if (modalRoot) {
                modalRoot.appendChild(el);
            }

            return () => {
                if (modalRoot) {
                    modalRoot.removeChild(el);
                }
            };
        }
    }, [el]);

    if (!isOpen || !el) {
        return null;
    }

    return ReactDOM.createPortal(
        <div style={styles.overlay}>
            <div style={styles.body}>
                <button onClick={onClose}>Close</button>
                {children}
            </div>
        </div>,
        el
    );
};

const styles = {
    overlay: {
        position: 'fixed' as 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    body: {
        backgroundColor: 'white',
        padding: '1em',
    },
};

export default Modal;
