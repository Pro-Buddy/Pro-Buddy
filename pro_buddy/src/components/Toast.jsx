import { useState, createContext, useContext, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toast, setToast] = useState({ show: false, message: '' });

    const showToast = useCallback((message) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    }, []);

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <div className={`toast${toast.show ? ' show' : ''}`} id="toast">
                <span className="toast-icon">✅</span>
                <span className="toast-message" id="toastMessage">{toast.message}</span>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
}
