import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const Main = () => (
    <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <App />
    </MuiThemeProvider>
)

ReactDOM.render(<Main />, document.getElementById('root'));
registerServiceWorker();
