import PropTypes from 'prop-types';
import React from 'react';
import autoBind from 'react-autobind';

class Suggestion extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this, 'handleClick', 'handleMouseMove');
    }

    handleClick() {
        this.props.onClick(this.props.suggestion);
    }

    handleMouseMove(event) {
        this.props.onMouseMove(event, this.props.index);
    }

    render() {
        const {props} = this;

        return (
            <li
                className={props.className}
                key={props.suggestion.id}
                ref={ref => (this.item = ref)}
                onClick={this.handleClick}
                onMouseMove={this.handleMouseMove}
                style={{lineHeight: '20px', height: '50px', marginRight: '10px',padding: '15px',borderBottom: '1px solid lightgray'}}
            >
                <div>
                    <strong>{props.suggestionRenderer(props.suggestion.id, props.searchTerm)}</strong><br></br>
                    <span style={{fontStyle: 'italic', textTransform: 'capitalize'}}>{props.suggestionRenderer(props.suggestion.name, props.searchTerm)}</span><br></br>
                        <span>{props.suggestionRenderer(props.suggestion.address, props.searchTerm)}</span>
                </div>
            </li>
        );
    }
}

Suggestion.propTypes = {
    className: PropTypes.string,
    index: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
    onMouseMove: PropTypes.func.isRequired,
    suggestion: PropTypes.any.isRequired,
    suggestionRenderer: PropTypes.func.isRequired
};

export default Suggestion;
