import React, { useState } from 'react';
import { useEffect } from 'react';
import Map from './Map'
import './App.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZmVybmFuZG90aHJlZWpzIiwiYSI6ImNsYnVkMnpjbjBjZW8zbm12czhiNWt3M2IifQ.j_U5JTl3c1eHQNZVH8glcA';

function App() {

  const [viewport, setViewport] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    zoom: 10,
    bearing: 0,
    pitch: 0,
    width: '100vw',
    height: '100vh'
  });

  return (
    <div className="App">
      <Map/>
    </div>
  );
}

export default App;