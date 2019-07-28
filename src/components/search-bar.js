import PropTypes from 'prop-types';
import React from 'react';
import autoBind from 'react-autobind';
import classNames from 'classnames';
import htmlElementAttributes from 'react-html-attributes';
import {debounce, isNil, pick} from 'lodash';
import Suggestions from './suggestions';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            focusedSuggestion: null,
            isFocused: false,
            searchTerm: null,
            value: '',
            isHover: false
        };

        this.attributes = pick(props, htmlElementAttributes.input);

        autoBind(
            this,
            'clearInput',
            'handleChange',
            'handleClick',
            'handleHover',
            'handleKeyDown',
            'handleSelection',
            'search',
            'toggleFocus'
        );

        this.handleDebouncedChange = debounce(
            this.handleDebouncedChange,
            props.delay
        );
    }

    componentDidMount() {
        if (this.props.autoFocus) {
            this.input.focus();
        }
        document.addEventListener('click', this.handleClick);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClick);
    }

    getNextIndex(current, last, isScrollingDown) {
        let next = null;

        if (isScrollingDown && current != last) {
            next = isNil(current) ? 0 : current + 1;
        } else if (!isScrollingDown && current != 0) {
            next = isNil(current) ? last : current - 1;
        }

        return next;
    }

    setFocusedSuggestion(isScrollingDown) {
        const {focusedSuggestion: current} = this.state;
        const {suggestions} = this.props;
        const last = suggestions.length - 1;
        const next = this.getNextIndex(current, last, isScrollingDown);
        this.setState({
            focusedSuggestion: next
        });
    }

    clearInput() {
        this.setState({
            focusedSuggestion: null,
            searchTerm: null,
            value: ''
        });
        this.input.focus();
        this.props.onClear();
    }

    toggleFocus() {
        this.setState({
            isFocused: !this.state.isFocused
        });
    }

    handleClick(event) {
        if (!this.container.contains(event.target)) {
            this.props.onClear();
        }
    }

    handleDebouncedChange(searchTerm) {
        this.setState({
            searchTerm
        });

        this.props.onChange(searchTerm);
    }

    handleChange(event) {
        const {value} = event.target;
        const searchTerm = value.toLowerCase().trim();

        if (!value) {
            this.clearInput();
            return;
        }

        this.setState({
            focusedSuggestion: null,
            value
        });

        if (searchTerm) {
            this.handleDebouncedChange(searchTerm);
        }
    }

    handleKeyDown(event) {
        if (this.state.isHover) {
            return false;
        }
        switch (event.key) {
            case 'ArrowUp':
            case 'ArrowDown':
                if (this.props.suggestions.length > 0) {
                    event.preventDefault();
                    this.setFocusedSuggestion(event.key === 'ArrowDown');
                }
                break;

            case 'Backspace':
                this.handleBackspace();
                break;

            case 'Enter':
                var currentSelected = this.state.focusedSuggestion;
                this.setState({
                    focusedSuggestion: null,
                    searchTerm: null,
                    value: this.props.suggestions[currentSelected].name
                });
                this.search();

                break;

            case 'Escape':
                this.handleEscape();
                break;
        }
    }

    handleBackspace() {
        this.setState({
            focusedSuggestion: null
        });
    }

    handleEscape() {
        this.setState({
            focusedSuggestion: null,
            searchTerm: ''
        });

        this.input.blur();
        this.props.onClear();
    }

    handleHover(current) {
        this.setState({
            focusedSuggestion: current,
            isHover: current === null ? false : true
        });
    }

    handleSelection(suggestion) {
        this.setState({
            focusedSuggestion: null,
            searchTerm: null,
            value: suggestion.name
        });
        this.search();
    }

    search() {
        this.props.onClear();
        this.props.onSearch(this.state.value.trim());
    }

    renderClearButton() {
        return (
            <button
                className={this.props.styles.clearButton}
                onClick={this.clearInput}
            />
        );
    }

    renderSearchButton() {
        return (
            <button
                className={this.props.styles.submitButton}
                onClick={this.search}
            />
        );
    }

    renderSuggestions(searchTerm, styles) {
        return (
            <Suggestions
                focusedSuggestion={this.state.focusedSuggestion}
                onSelection={this.handleSelection}
                onSuggestionHover={this.handleHover}
                searchTerm={searchTerm}
                styles={styles}
                suggestions={this.props.suggestions}
                suggestionRenderer={this.props.suggestionRenderer}
            />
        );
    }

    renderNoData(searchTerm) {
        if (searchTerm) {
            return (
                <div style={{ fontSize:'20px', padding: '25px', color:'red', marginRight: '10px'}}>No Data Found</div>
            );
        } else {
            return (
                <div></div>
            );
        }
    }

    render() {
        const {props, state} = this;
        const {styles} = props;
        const shouldRenderSuggestions = state.value && props.suggestions.length > 0;

        return (
            <div className={styles.wrapper} ref={ref => (this.container = ref)}>
                <div
                    className={classNames({
                        [styles.field]: true,
                        [styles.fieldFocused]: state.isFocused,
                        [styles.hasSuggestions]: props.suggestions.length > 0
                    })}
                >
                    <input
                        {...this.attributes}
                        className={styles.input}
                        type="text"
                        ref={ref => (this.input = ref)}
                        value={state.value}
                        onChange={this.handleChange}
                        onFocus={this.toggleFocus}
                        onBlur={this.toggleFocus}
                        onKeyDown={props.suggestions && this.handleKeyDown}
                    />
                    {state.searchTerm && this.renderClearButton()}
                    {this.renderSearchButton()}
                </div>
                {shouldRenderSuggestions && this.renderSuggestions(state.searchTerm, styles)}
                {!shouldRenderSuggestions && this.renderNoData(state.searchTerm, styles)}
            </div>
        );
    }
}

SearchBar.propTypes = {
    autoFocus: PropTypes.bool,
    delay: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    onSearch: PropTypes.func,
    onSelection: PropTypes.func,
    styles: PropTypes.object,
    suggestions: PropTypes.array.isRequired,
    suggestionRenderer: PropTypes.func
};

SearchBar.defaultProps = {
    autoFocus: false,
    delay: 0,
    maxLength: 100,
    placeholder: '',
    suggestionRenderer: suggestion => <div>{suggestion}</div>
};

export default SearchBar;
