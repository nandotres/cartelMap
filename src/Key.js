import React from 'react';
import { useState, useEffect } from 'react';

const MapKey = () => {

  const [legendItems, setLegendItems] = useState([]);

  const legendEvents = [
    {
      "icon": "🎯",
      "name": "ASSASSINATION"
    },
    {
      "icon": "🏛️",
      "name": "ARREST"
    },
    {
      "icon": "📣",
      "name": "PSA"
    },
    {
      "icon": "⚔️",
      "name": "BATTLE"
    },
    {
      "icon": "⚖️",
      "name": "LEGAL"
    }
  ]

  useEffect(() => {
    fetch('/cartels.json')
      .then(response => response.json())
      .then(data => {

        const items = Object.keys(data).map(key => ({
          color: data[key].color,
          label: data[key].abbreviation
        }))

        console.log(items)
        
        setLegendItems(items)

      })
      .catch(error => console.error('Error fetching data:', error));
  }, [])

  return (
    <div style={styles.container}>
      <ul style={styles.list}>
        {legendItems.map((item, index) => (
          <li key={index} style={styles.listItem}>
            <span
              style={{ ...styles.colorBox, backgroundColor: item.color }}
            ></span>
            <span>{item.label}</span>
          </li>
        ))}
        {legendEvents.map((item, index) => (
          <li key={index} style={styles.listItem}>
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    position: 'absolute',
    bottom: '10px',
    margin: '25px',
    padding: '10px',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
    fontSize: '12px',
    width: 'fit-content',
    marginTop: '20px',
    color: 'black',
    fontFamily: 'MyCustomFont, sans-serif'
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
  },
  colorBox: {
    width: '10px',
    height: '10px',
    marginRight: '10px',
    border: '1px solid #ccc',
  },
};

export default MapKey;
