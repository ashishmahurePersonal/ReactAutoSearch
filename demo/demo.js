import React from 'react';
import ReactDOM from 'react-dom';
import autoBind from 'react-autobind';

import SearchBar from '../src';
import styles from './demo.css';
import words from './words.json';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            suggestions: []
        };

        autoBind(this, 'handleChange', 'handleClear', 'handleSelection');
    }

    handleClear() {
        this.setState({
            suggestions: []
        });
    }

    handleChange(input) {
        this.setState({
            suggestions: words.filter(word => {
                let name = word.name.toLowerCase(),
                    address = word.address.toLowerCase();
                return word.id.startsWith(input) || name.startsWith(input) || address.startsWith(input);
            })
        });
    }

    suggestionRenderer(suggestion, searchTerm) {
        let suggestionUpper = suggestion.toLowerCase();

        if (suggestionUpper.startsWith(searchTerm)) {
            return (
                <span>
                    <span style={{color: 'cornflowerblue'}}>{searchTerm}</span>
                    <strong>{suggestion.substr(searchTerm.length)}</strong>
                </span>
            );
        } else {
            return (
                <span>
                    <strong>{suggestion}</strong>
                </span>
            );
        }
    }

    render() {
        return (
            <SearchBar
                autoFocus
                renderClearButton
                renderSearchButton
                placeholder="Search User By ID, Name, Address...."
                onChange={this.handleChange}
                onClear={this.handleClear}
                onSelection={this.handleSelection}
                onSearch={this.handleSearch}
                suggestions={this.state.suggestions}
                suggestionRenderer={this.suggestionRenderer}
                styles={styles}
            />
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));
