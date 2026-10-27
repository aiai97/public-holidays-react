const Accordion = ({ title, content, isActive, onToggle }) => {

    return (
        <div className="accordion-item">
            <button
                className="accordion-title"
                type="button"
                aria-expanded={isActive}
                onClick={onToggle}
            >
                <span>{title}</span>
                <svg
                    className="accordion-icon"
                    viewBox="0 0 16 16"
                    width="16"
                    height="16"
                    aria-hidden="true"
                >
                    <path d={isActive ? 'm4 10 4-4 4 4' : 'm4 6 4 4 4-4'} />
                </svg>
            </button>
            {isActive && <div className="accordion-content">{content}</div>}
        </div>
    );
};

export default Accordion;
