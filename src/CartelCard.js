import React from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import './CartelCard.css'

const CartelCard = ({ name, leader, foundingDate, history, factions }) => {

  console.log(factions)

    return (
      <div class="flex" style={styles.card}>
      <div class="w-1/2 place-content-center">
        <h2 class="text-3xl font-bold" style={styles.title}>{name}</h2>
        {foundingDate !== null && (
          <>
          <p style={styles.date}>Est. {foundingDate}</p>
          <p style={styles.description}>Kingpin: {leader}</p>
          </>
        )}
      </div>
      <div class="w-1/2">
      {foundingDate !== null && ( <>      
        <div class="dropdown">
          <div tabindex="0" role="button" class="hover:bg-red-50 rounded-none text-xl text-black border-none bg-transparent btn mx-24">HISTORY📜</div>
          <div
            tabindex="0"
            class="dropdown-content card card-compact bg-white text-primary-content z-[1] m-2 h-96 overflow-y-scroll w-64 p-2 shadow rounded-none">
            <div class="select-none card-body">
            {Object.values(history).map((era) => (<>
                <h3 class="card-title">{era.name}</h3>
                <p>{era.description}</p>
                </>))}
            </div>
          </div>
        </div>
        <div class="dropdown">
          <div tabindex="0" role="button" class="hover:bg-red-50 rounded-none text-xl text-black border-none bg-transparent btn mx-24">MAJOR FACTIONS🏴</div>
          <div
            tabindex="0"
            class="dropdown-content card card-compact bg-white text-primary-content z-[1] m-2 h-96 overflow-y-scroll w-64 p-2 shadow rounded-none">
            <div class="select-none card-body">
              {Object.values(factions).map((faction) => (<>
                <h3 class="card-title">{faction.name}</h3>
                <p>{faction.description}</p>
                </>))}
            </div>
          </div>
        </div>
        <div role="tablist" class="tabs tabs-lifted">
      </div>
      </> )}
      </div>
      </div>
    )
}

const styles = {
  card: {
    position: 'absolute',
    top: '0',
    zIndex: '10',
    padding: '16px',
    width: "100vw",
    color: 'black',
    backgroundImage: `url('/paper-texture.jpg')`,
    fontFamily: 'MyCustomFont, sans-serif'
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

CartelCard.propTypes = {
  name: PropTypes.string.isRequired,
  leader: PropTypes.string.isRequired,
  foundingDate: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
  factions: PropTypes.object.isRequired
};

export default CartelCard