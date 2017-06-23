import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Button } from 'semantic-ui-react';

const App = () => (
    <Button>
        Click Here
    </Button>
);

ReactDOM.render(
    <App />,
    document.getElementById('app')
);
