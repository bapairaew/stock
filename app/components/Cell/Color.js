const getState = ({ value, cleanValue, removed }) => removed ? 0 : cleanValue === undefined ? 1 : cleanValue === value ? 2 : 3;

// red, green, white, yellow
export const getEditableCellBackground = (props) => ['rgb(249,216,204)', 'rgb(234,253,230)', '#fff', 'rgb(255,248,229)'][getState(props)];
export const getInEditableCellBackground = (props) => ['rgb(247,207,194)', 'rgb(225,243,221)', '#f5f5f5', 'rgb(255,244,216)'][getState(props)];
