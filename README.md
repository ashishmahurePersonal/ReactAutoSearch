A general-purpose search bar, built in React. View the [demo](https://vakhtang.github.io/react-search-bar).

## Development

To run the dev server:

```sh
npm start
```

To run tests and lint:

```sh
npm run check
```

## Props

| Prop                     | Type             |             Required              | Description                                                                                |
| :------------------------| :--------------- | :-------------------------------: | :----------------------------------------------------------------------------------------- |
| autoFocus                | _boolean_        |                                   | If `true`, focuses the input when the component loads                                      |
| delay                    | _number_         |                                   | The number of milliseconds to wait after the last key stroke before calling `onChange`     |
| onChange                 | _function_       |             &#x2713;              | Called when input changes                                                                  |
| onClear                  | _function_       |             &#x2713;              | Called when suggestions are cleared                                                        |
| onSearch                 | _function_       | &#x2713;[<sup>1</sup>](#footnote) | Called when clicking the search button or enter (presumes that search button is available) |
| onSelection              | _function_       |                                   | Called when selecting a suggestion                                                         |
| shouldRenderClearButton  | _boolean_        |                                   | Flag indicating whether to display the clear button                                        |
| shouldRenderSearchButton | _boolean_        |                                   | Flag indicating whether to display the search button                                       |
| style                    | _object_         |                                   | Style object                                                                               |
| suggestionRenderer       | _function_       |                                   | Function to render suggestions                                                             |
| suggestions              | _array\<string>_ |             &#x2713;              | Array of suggestions                                                                       |

Also accepts [supported HTML attributes](https://facebook.github.io/react/docs/dom-elements.html#all-supported-html-attributes) for the `<input>` element.

<sup id="footnote">1</sup> Only when `renderSearchButton` is `true`

## License

MIT
