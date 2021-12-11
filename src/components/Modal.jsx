function Modal(props) {
    if (!props.show) {
        return null
    }

    return (
        <div className={`modal ${props.show ? 'show' : ''}`} onClick={props.onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h1 className="mb-3 modal-header">{props.title}</h1>
                </div>

                <div className="modal-body">{props.children}</div>
            </div>
        </div>
    )
}

export default Modal