import React from 'react';
import PropTypes from 'prop-types';

const StoryCard = ({ title, date, description, coordinates, location }) => {
  return (
    <div style={styles.card}>
      <h2 style={styles.title}>{title}</h2>
      <p style={styles.date}>{date}</p>
      <p style={styles.description}>{description}</p>
      <p style={styles.location}>Location: {location}</p>
    </div>
  );
};

const styles = {
  card: {
    position: 'absolute',
    top: 0,
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    maxWidth: '400px',
    margin: '16px auto',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '24px'
  },
  date: {
    margin: '0 0 16px 0',
    color: '#888'
  },
  description: {
    margin: '0 0 16px 0',
    fontSize: '16px'
  },
  location: {
    margin: '0 0 8px 0',
    fontWeight: 'bold'
  },
  coordinates: {
    margin: '0',
    fontStyle: 'italic'
  }
};

StoryCard.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
  location: PropTypes.string.isRequired
};

export default StoryCard;
