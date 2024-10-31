//mapboxgl.accessToken = 'pk.eyJ1IjoiZmVybmFuZG90aHJlZWpzIiwiYSI6ImNsYnVkMnpjbjBjZW8zbm12czhiNWt3M2IifQ.j_U5JTl3c1eHQNZVH8glcA';
import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Threebox } from 'threebox-plugin'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import CartelCard from './CartelCard'
import ExitButton from './ExitButton'
import Key from './Key'
import Icon from './Icon'

gsap.registerPlugin(useGSAP);

const Map = () => {

  const mapContainerRef = useRef();
  const mapRef = useRef();

  let selectedCartel = 'null'
  const newLayers = []; // Track new layers

  let [currentCartel, setCurrentCartel] = useState({
    name: ' Mexican Cartel Presence and Territory Claims',
    leader: 'null',
    foundingDate: null,
    history: null,
    factions: null,
    isSelected: false
  })

  useEffect(() => {
    
    mapboxgl.accessToken = 'pk.eyJ1IjoiZmVybmFuZG90aHJlZWpzIiwiYSI6ImNsYnVkMnpjbjBjZW8zbm12czhiNWt3M2IifQ.j_U5JTl3c1eHQNZVH8glcA';

    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: 'map',
      center: [-102.55285, 23.6345],
      zoom: 4.5,
      pitch: 45,
      bearing: 0,
      style: 'mapbox://styles/mapbox/dark-v11',
    });

    //use gsap to adjust zoom
    const animateZoom = (startZoom, endZoom, duration) => {
      const zoomObj = { zoom: startZoom };
    
      gsap.to(zoomObj, {
        zoom: endZoom,
        duration: duration,
        onUpdate: () => {
          mapRef.current.setZoom(zoomObj.zoom);
        },
        ease: "power1.inOut"
      });
    };
  
    //use gsap to adjust the center of the map
    const animatePan = (startCoordLng, startCoordLat, endCoordLng, endCoordLat, duration) => {
      const panObj = { 
        longitude: startCoordLng,
        latitude: startCoordLat
      };
    
      gsap.to(panObj, {
        longitude: endCoordLng,
        latitude: endCoordLat,
        duration: duration,
        onUpdate: () => {
          mapRef.current.setCenter([panObj.longitude, panObj.latitude]);
        },
        ease: "power1.inOut" // Optional: Choose an easing function
      });
    };

    //allow for multiple json files to be read from
    Promise.all([
      //fetch object list of cartels with information on each one
      fetch('./cartels.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      }),
      //fetch object list of recent cartel activity
      fetch('./stories.json')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
      ]).then(([cartelData, storiesData]) => {
        if (cartelData && typeof cartelData === 'object') {

        /*
        The initial style of the map has been loaded. 
        All sources and layers specified in the style have been loaded.
        All required tiles, glyphs, and sprites for the initial view have been fetched and rendered.
        */
        mapRef.current.on('load', () => {

          console.log(storiesData)

          for(let key in storiesData) {
            if (storiesData.hasOwnProperty(key)){
              let story = storiesData[key]

              console.log(story.type)

              const date = new Date(story.date);

              const scale = ((date.getTime() - 172000000000) * .00000000002)

              console.log(date.getTime() - 1720000000000)

              const el = document.createElement('div')
              el.className = 'marker'
              el.style.backgroundImage = `url(icons/${story.type}.png)`
              el.style.width = `${scale}px`
              el.style.height = `${scale}px`
              el.style.backgroundSize = '100%'
              el.style.display = 'block'
              el.style.border = 'none'
              el.style.cursor = 'pointer'
              el.style.padding = 0

              el.addEventListener('click', (e) => {

                e.stopPropagation();

                const infoDiv = document.createElement('div')
                
                infoDiv.style.position = 'absolute'
                infoDiv.style.width = '400px'
                infoDiv.style.height = 'fit-content'
                infoDiv.style.backgroundColor = 'white'
                infoDiv.style.border = '1px solid #ccc'
                infoDiv.style.padding = '10px'
                infoDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)'
                infoDiv.style.fontFamily = 'MyCustomFont, sans-serif'
                infoDiv.innerHTML = `
                  <div class="select-none grid-rows-2">
                    <div class="columns-3">
                      <div>
                        <img class="-translate-x-2 -translate-y-2 shadow-2xl rotate-6 size-28" src="story_pictures/${story.image}"/>
                        <img class="size-12 -top-1.5 left-6 absolute z-10" src="story_pictures/paperclip.png" />
                      </div>
                      <div class="text-sm text-black">
                        <h1>${story.title}</h1>
                        <h2 class="text-slate-500">${story.date}</h2>
                      </div>
                      <div class="btn btn-outline btn-error absolute top-6 right-6 close-popup">✗</div>
                    </div>
                    <h1>${story.description}</h1>
                  </div>
                `

                //update the position of the div
                const updatePosition = () => {
                    const pos = mapRef.current.project(story.coordinates)
                    infoDiv.style.transform = `translate(${pos.x - infoDiv.offsetWidth / 2}px, ${pos.y - infoDiv.offsetHeight - 30}px)`
                }

                // Append the div to the map container
                mapRef.current.getContainer().appendChild(infoDiv)

                // Initial positioning
                updatePosition()

                // Update the position of the div when the map moves or zooms
                mapRef.current.on('move', updatePosition)
                mapRef.current.on('zoom', updatePosition)

                const closeButton = infoDiv.querySelector('.close-popup');
                closeButton.addEventListener('click', () => {
                    infoDiv.remove();
                });
              });

              new mapboxgl.Marker(el)
              .setLngLat(story.coordinates)
              .addTo(mapRef.current)
            }
          }

          setTimeout(() => { // A separate function to handle layer addition
            mapRef.current.triggerRepaint(); // Force a repaint after layers are added
          }, 100);
        })

        for (let key in cartelData) {
          if (cartelData.hasOwnProperty(key)) {
            let cartel = cartelData[key];

            //fetch each geojson file
            fetch(`cartel_maps/${cartel.path}.geojson`)
              .then(response => {
                if (!response.ok) {
                  throw new Error(`GeoJSON file not found: ${response.status}`);
                }
                return response.json();
              })
                .then(geoData => {
                  //checks formatting
                  if (geoData && geoData.type === 'FeatureCollection') {
                    if (!mapRef.current.getSource(cartel.path)) {
                      mapRef.current.addSource(cartel.path, {
                        type: 'geojson',
                        data: `cartel_maps/${cartel.path}.geojson`,
                      });
                    }

                    const layerId = `${cartel.path}-fill`;
                    if (!mapRef.current.getLayer(layerId)) {
                      mapRef.current.addLayer({
                        id: layerId,
                        type: 'fill',
                        source: cartel.path,
                        layout: {},
                        paint: {
                          'fill-color': cartel.color,
                          'fill-opacity': 0.2,
                        },
                      });
                      newLayers.push(layerId); // Add layer to tracking
                    }

                    //cartel paint layer has been clicked
                    mapRef.current.on('click', layerId, (e) => {

                      //create min max coordinate test variables
                      let minLongitude = Infinity;
                      let maxLongitude = -Infinity;
                      let minLatitude = Infinity;
                      let maxLatitude = -Infinity;

                      //loop through each collection of coordinates
                      geoData.features.forEach(feature => {

                        //loop through each set of coordinates
                        feature.geometry.coordinates[0].forEach(coordinate => {

                        const [longitude, latitude] = coordinate;

                        //find min max value of each coordinate
                        if (longitude < minLongitude) minLongitude = longitude;
                        if (longitude > maxLongitude) maxLongitude = longitude;
                        if (latitude < minLatitude) minLatitude = latitude;
                        if (latitude > maxLatitude) maxLatitude = latitude;
                        })
                      });

                      //pan the camera to each cartel territory
                      animatePan(mapRef.current.getCenter().lng, mapRef.current.getCenter().lat, (maxLongitude + minLongitude)/2, (maxLatitude + minLatitude)/2, 3)

                      //find height and width of each territory in degrees
                      let longDistance = Math.abs(Math.abs(minLongitude) - Math.abs(maxLongitude))
                      let latDistance = Math.abs(Math.abs(minLatitude) - Math.abs(maxLatitude))

                      //zoom the camera to an appropriate distance from the territory
                      animateZoom(mapRef.current.getZoom(),  Math.log2(360 / Math.max(longDistance, latDistance)), 3)

                      //select cartel
                      setCurrentCartel(prevState => ({...prevState, 
                        name: cartel.name, 
                        leader: cartel.leader, 
                        foundingDate: cartel.foundingDate,
                        isSelected: true,
                        history: cartel.history,
                        factions: cartel.factions
                      }))

                      //use gsap to animate selected layer opacity
                      const animateShading = (layer, startOpacity, endOpacity, duration) => {
                        const opacityObj = { opacity: startOpacity };

                        gsap.to(opacityObj, {
                          opacity: endOpacity,
                          duration: duration,
                          onUpdate: () => {
                            mapRef.current.setPaintProperty(layer, 'fill-opacity', opacityObj.opacity);
                          },
                          ease: "power1.inOut"
                        });
                      };

                      let previousCartel = selectedCartel
                      selectedCartel = cartel.path

                      if(previousCartel !== 'null'){animateShading(`${previousCartel}-fill`, 0.7, 0.2, 1)}

                      // Set opacity of selected layer
                      animateShading(`${selectedCartel}-fill`, 0.2, 0.7, 1)

                      console.log('Clicked feature:', e.features[0]);
                    });

                    mapRef.current.on('mousemove', layerId, () => {
                      mapRef.current.getCanvas().style.cursor = 'pointer';
                    });

                    mapRef.current.on('mouseleave', layerId, () => {
                      mapRef.current.getCanvas().style.cursor = '';
                    });
                  } else {
                    console.error(`Invalid GeoJSON data for ${cartel.path}`);
                  }
                })
                .catch(error => console.error('Error fetching GeoJSON file:', error));
            }
          }
        } else {
          console.error('Invalid cartels data format');
        }

      })
      .catch(error => console.error('Error loading JSON file:', error));

    }, []);

  return (
    <>
      <div id="map" ref={mapContainerRef} style={{ height: '100%' }}></div>
        <>
          <CartelCard name={currentCartel.name} leader={currentCartel.leader} foundingDate={currentCartel.foundingDate} history={currentCartel.history} factions={currentCartel.factions} />
          <Key />
        </>
    </>
  );
};

export default Map;