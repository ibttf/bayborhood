import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import '../styles/animations.css';
import logo from "../styles/logo.png"
mapboxgl.accessToken = process.env.REACT_APP_TOKEN;

const Home = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-122.22);
  const [lat, setLat] = useState(37.77);
  const [zoom, setZoom] = useState(8);

  useEffect(() => {

    if (map.current) return; // initialize map only once

        const geoJsonData = require('../data/cities2.geojson');
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v10',
          center: [lng, lat],
          zoom: zoom,
          minZoom: 8,
        });

        const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });


      map.current.on('load', () => {
        map.current.addSource('city', {
          type: 'geojson',
          data: geoJsonData,
        });

        map.current.addLayer({
          id: 'city-layer',
          type: 'fill',
          source: 'city',
          paint: {
            'fill-color': '#38bdf8',
            'fill-opacity': 0.8,
          },
        });

        


      });

      map.current.on('mouseenter', 'city-layer', (e) => {
        map.current.getCanvas().style.cursor = 'pointer';
      
        // Debugging: log the properties object to see its structure
      
        const { jurname } = e.features[0].properties;
        const coordinates = e.features[0].geometry.coordinates;
      
        // Find a point within the MultiPolygon to use for the popup
        const point = coordinates[0][0]; // Use the first point of the first polygon
        
        const lngLat = [point[0][0], point[0][1]]; // Reversed order
        console.log(lngLat)
        
        popup
          .setLngLat(lngLat) // Set the correct LngLat order
          .setHTML(`<p>${jurname}</p>`)
          .addTo(map.current);
        map.current.getCanvas().style.cursor = 'pointer';
    
      });
      
      map.current.on('mouseleave', 'city-layer', () => {
        map.current.getCanvas().style.cursor = '';
        popup.remove();
      });
  



      map.current.on('move', () => {
        const newLng = map.current.getCenter().lng.toFixed(4);
        const newLat = map.current.getCenter().lat.toFixed(4);

        setZoom(map.current.getZoom().toFixed(2));
      });

      map.current.on('drag', () => {
        const center = map.current.getCenter();
        const newLng = Math.max(-122.5, Math.min(-122, center.lng));
        const newLat = Math.max(37.5, Math.min(38, center.lat));

        if (center.lng !== newLng || center.lat !== newLat) {
          map.current.setCenter(new mapboxgl.LngLat(newLng, newLat));
        }
      });

      

  });

  const handleZoomIn = () => {
    map.current.zoomTo(map.current.getZoom() + 1, { duration: 200 });
  };

  const handleZoomOut = () => {
    map.current.zoomTo(map.current.getZoom() - 1, { duration: 200 });
  };


  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="w-1/4 h-screen">
        <div style={{width:"100%"}} className="bg-blue-100 border-b-8 border-blue-900 p-3 flex items-center justify-center">
          <img src={logo}  className="w-20 h-20"/>
          <h1 className="text-left text-4xl font-semibold text-red-700 font-mono">
            <span>
              Bay
            </span>
              borhood
          </h1>
          <p className="border-2 rounded-full justify-center items-center flex ml-2 -mt-4 
                  text-gray-400 border-gray-400 h-5 w-5  font-semibold
                  hover:text-gray-700 hover:border-gray-700 duration-200 cursor-pointer
                  font-serif"
                  style={{fontSize:"12px"}}>i</p>
        </div>
      </div>
      <div className="w-full">
        <div className="absolute top-2 right-2 z-10 flex flex-col">
          <button className="text-xl font-extrabold text-black rounded-t-xl border-2 shadow-2xl  bg-white hover:bg-gray-200 duration-200 p-1 w-9 h-10" onClick={handleZoomIn}>
            +
          </button>
          <button className="text-xl font-extrabold text-black rounded-b-xl border-2 border-t-0 shadow-2xl bg-white hover:bg-gray-200 duration-200 p-1 w-9 h-10" onClick={handleZoomOut}>
            -
          </button>
        </div>
        <div ref={mapContainer} className="absolute top-0" style={{ height: '100%', width:"80%" }} />
      </div>

    </div>
  );
};

export default Home;