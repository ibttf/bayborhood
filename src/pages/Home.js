import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import '../styles/animations.css';
import logo from "../styles/logo.png"
mapboxgl.accessToken = process.env.REACT_APP_TOKEN;

const Home = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const [mapLoaded, setMapLoaded] = useState(false);

  const [lng, setLng] = useState(-122.22);
  const [lat, setLat] = useState(37.77);
  const [zoom, setZoom] = useState(8);

  
  const [showCountyColors,setShowCountyColors]=useState(false)


  useEffect(() => {
    const geoJsonData = require('../data/cities.geojson');

    //SETTING INITIAL MAP IN BAY AREA
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [lng, lat],
      zoom: zoom,
      minZoom: 7,
    });

    //FUNCTION TO UPDATE COLORS
    const updateFillColor = () => {
      map.current.setPaintProperty('region-fill', 'fill-color', showCountyColors
        ? [
            'match',
            ['get', 'objectid'],
            '1', 'lightgreen',
            '2', 'orange',
            '3', 'pink',
            '4', 'blue',
            '5', 'yellow',
            '6', 'red',
            '7', 'purple',
            '8', 'magenta',
            '9', 'brown',
            'lightblue' // Default value if no match
          ]
        : 'blue' // static color fill
      );
    };

    //ADDING REGION FILLS AND OUTLINES
    map.current.on('load', () => {
      map.current.addSource('city', {
        type: 'geojson',
        data: geoJsonData,
      });


      //ADD REGION FILLS
      map.current.addLayer({
        id: 'region-fill',
        type: 'fill',
        source: 'city',
        paint: {
          'fill-color': 'blue', // Initial static color fill
          'fill-opacity': 0.7,
        },
      });
      // ADD OUTLINES
      map.current.addLayer({
        id: 'region-outline',
        type: 'line',
        source: 'city',
        paint: {
          'line-color': '#ffffff',
          'line-width': 1,
          'line-opacity': 0.5,
        },
      });
      //UPDATE FILL COLOR ONCE MAP IS DONE LOADING
      updateFillColor(); 

    });




    //UPDATE ZOOM AND CENTER OF MAP BASED ON DRAG
      map.current.on('move', () => {
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
        // Create a single popup element outside of mouse events
        const popupDiv = document.createElement('div');
        popupDiv.style.position = 'absolute';
        popupDiv.style.backgroundColor = 'white';
        popupDiv.style.padding = '5px';
        popupDiv.style.border = '1px solid #ccc';
        popupDiv.style.borderRadius = '3px';
        popupDiv.style.pointerEvents = 'none'; // Allow mouse events to pass through
        popupDiv.style.display = 'none'; // Initially hidden
        document.body.appendChild(popupDiv);

        map.current.on('mouseenter', 'region-fill', (e) => {
          const { county } = e.features[0].properties;
        
          if (county) {
            popupDiv.innerHTML = `<p>${county}</p>`;
            popupDiv.style.display = 'block'; // Show the popup
          }
        });
        
        map.current.on('mousemove', 'region-fill', (e) => {
          const { county } = e.features[0].properties;
        
          if (county) {
            popupDiv.innerHTML = `<p>${county}</p>`; // Update the content
          }
        
          // Update the position of the popup
          const x = e.originalEvent.clientX;
          const y = e.originalEvent.clientY;
          popupDiv.style.left = `${x}px`;
          popupDiv.style.top = `${y}px`;
          popupDiv.style.transform = 'translate(-50%, -140%)';
        });
        
        map.current.on('mouseleave', 'region-fill', () => {
          popupDiv.style.display = 'none'; // Hide the popup
        });
  
      setMapLoaded(true);
  },[]);

  useEffect(() => {
    //SECOND USE EFFECT TO UPDATE COLORS WITHOUT RERENDER
    if (map.current && mapLoaded) {
      map.current.setPaintProperty('region-fill', 'fill-color', showCountyColors
        ? [
            'match',
            ['get', 'objectid'],
            '1', 'lightgreen',
            '2', 'orange',
            '3', 'pink',
            '4', 'blue',
            '5', 'yellow',
            '6', 'red',
            '7', 'purple',
            '8', 'magenta',
            '9', 'brown',
            'lightblue' // Default value if no match
          ]
        : 'blue' // static color fill
      );
    }
  }, [showCountyColors, mapLoaded]);



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
        
        <div className="absolute bottom-2 right-2 z-10 flex flex-col">
          <button className="text-md font-semibold text-black rounded-md border-2  bg-white hover:bg-gray-200 duration-200 p-1 w-full" onClick={()=>{setShowCountyColors(!showCountyColors)}}>
            {showCountyColors ? "Hide County Colors" : "Show County Colors"}
          </button>
      
        </div>
        
        <div ref={mapContainer} className="absolute top-0" style={{ height: '100%', width:"80%" }} />
      </div>

    </div>
  );
};

export default Home;