// @flow

import * as React from 'react';
import TimeFeed from './components/TimeFeed';
import './App.css';
import { PostProvider } from './context/PostContext';

function App(): React.MixedElement {
  return (
    <PostProvider>
      <div className="App">
        <TimeFeed/>
      </div>
    </PostProvider>
  );
}

export default App;
