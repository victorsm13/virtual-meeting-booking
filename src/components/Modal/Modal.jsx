import './Modal.css'

export function Modal({ isOpen, onClose, message, footer, confirm, cancel }) {

    if (!isOpen) return null;

    return (
        <div className='modal-overlay' onClick={onClose}>
            <div className="modal-container"
                onClick={(e) => e.stopPropagation()}
            >
                <header>
                    {
                        footer === true ? null : ( <button className="close-btn"
                        onClick={onClose}
                    ><img src='../../images/close-icon.svg' alt='close-icon' width='20px' /></button> )
                    }
                    
                </header>
                <div className="modal-content">
                    <p className='message'>{message}</p>
                </div>
                {
                    footer && (
                        <footer className='btt-box'>
                            <button id='confirm' type='button' onClick={confirm}>Confirm</button>
                            <button id='cancel' type='button' onClick={cancel}>Cancel</button>
                        </footer>
                    )
                }


            </div>
        </div>
    )
}