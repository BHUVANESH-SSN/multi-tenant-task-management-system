import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ open, title, onClose, children, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[80]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm" aria-hidden="true" onClick={onClose}></div>
      <div className="relative flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className={`w-full ${maxWidth} max-h-[calc(100vh-2rem)] overflow-y-auto rounded-xl border-2 border-gray-300 bg-white shadow-2xl dark:border-gray-600 dark:bg-gray-800`}>
          <div className="flex items-center justify-between border-b-2 border-gray-300 px-4 py-4 dark:border-gray-600 sm:px-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white" id="modal-title">
              {title}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none dark:hover:bg-gray-700 dark:hover:text-gray-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
