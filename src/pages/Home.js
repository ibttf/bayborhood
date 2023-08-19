import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import '../styles/animations.css';
import logo from "../styles/logo.png"
import {BsShield, BsTree,BsTrainFront} from "react-icons/bs"
import {GrLocation} from "react-icons/gr"
import {AiOutlineShoppingCart} from "react-icons/ai"
import {PiPersonSimpleBikeBold} from "react-icons/pi"
import {CiDumbbell} from "react-icons/ci"
import {LiaBusSolid} from "react-icons/lia"
mapboxgl.accessToken = process.env.REACT_APP_TOKEN;

const Home = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const parkMarkers = useRef([]); 

  const [mapLoaded, setMapLoaded] = useState(false);

  const [lng, setLng] = useState(-122.42);
  const [lat, setLat] = useState(37.75);
  const [zoom, setZoom] = useState(11);

  
  const [showQuadrantColors,setShowQuadrantColors]=useState(false)
  const [showParks,setShowParks]=useState(false);
  const [showCrime,setShowCrime]=useState(false);
  

  const updateOpacity = () => {
    if (!map.current) return;
  
    // Define the base opacity expression
    let opacityExpression = ['+', 1];
  
    // Add park_score based opacity if showParks is true
    if (showParks) {
      opacityExpression = ['-', opacityExpression, ['*', ['get', 'park_score'], 0.1]];
    }
  
    // Add crime_score based opacity if showCrime is true
    if (showCrime) {
      opacityExpression = ['-', opacityExpression, ['*', ['get', 'crime_score'], 0.1]];
    }
  
    // Ensure opacity doesn't exceed 1
    opacityExpression = ['min', 1, opacityExpression];
  
    // Set the calculated opacity expression to the 'quadrant-fill' layer
    map.current.setPaintProperty('quadrant-fill', 'fill-opacity', opacityExpression);
  };



  //FUNCTION TO SHOW PARKS
  // Function to toggle park markers
  //   const toggleParkMarkers = (show) => {
  //     if (show) {
  //       fetch('/static/media/parks.157b43c98b996f8882ca.geojson')
  //       .then((r) => r.json())
  //       .then((data) => {
  //         data.features.forEach((feature) => {
  //           // Create markers using feature properties
  //           const popup = new mapboxgl.Popup({ offset: 25 }).setText(
  //             feature.properties.Map_Label
  //           );
  //           const { coordinates } = feature.geometry;
  //           const marker = new mapboxgl.Marker({
  //             color: '#57fa7d',
  //             scale: 0.6,
  //           })
  //             .setLngLat(coordinates)
  //             .setPopup(popup)
  //             .addTo(map.current);
  
  //           // Add the created marker to the parkMarkers array
  //           parkMarkers.current.push(marker);
  //         });
  //       });
  //   } else {
  //     // Remove existing markers if show is false
  //     parkMarkers.current.forEach((marker) => marker.remove());
  //     parkMarkers.current = [];
  //   }
  // };



  useEffect(() => {
    const neighborhoods=require('../data/neighborhoods.geojson');

    //SETTING INITIAL MAP IN BAY AREA
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [lng, lat],
      zoom: zoom,
      minZoom: 10,
    });

    //ADDING REGION FILLS AND OUTLINES


    map.current.on('load', () => {
      // Adding neighborhoods source (includes quadrants info)
      map.current.addSource('neighborhoods', {
        type: 'geojson',
        data: neighborhoods,
      });

      // Neighborhood fill layer NECESSARY FOR MOUSEMOVE
      map.current.addLayer({
        id: 'neighborhood-fill',
        type: 'fill',
        source: 'neighborhoods',
        paint: {
          'fill-color': 'transparent'
        },
      });

      // Neighborhood outline layer
      map.current.addLayer({
        id: 'neighborhood-outline',
        type: 'line',
        source: 'neighborhoods',
        paint: {
          'line-color': 'white',
          'line-width': 1,
          'line-opacity': 0.5,
        },
      });

      // Quadrant fill layer (using same neighborhoods source)
      map.current.addLayer({
        id: 'quadrant-fill',
        type: 'fill',
        source: 'neighborhoods',
        paint: {
          'fill-color': 'blue',
          'fill-opacity': 0.8,
        },
      });

      // Quadrant outline layer (using same neighborhoods source)
      map.current.addLayer({
        id: 'quadrant-outline',
        type: 'line',
        source: 'neighborhoods',
        paint: {
          'line-color': '#ffffff',
          'line-width': 1,
          'line-opacity': 0.5,
        },
      });


    // POPUP BASED ON NEIGHBORHOOD/QUADRANT
      const popupDiv = document.createElement('div');
      popupDiv.style.position = 'absolute';
      popupDiv.style.backgroundColor = '#334155';
      popupDiv.style.color="white";
      popupDiv.style.padding = '10px';
      popupDiv.style.borderRadius = '1px';
      popupDiv.style.pointerEvents = 'none'; // Allow mouse events to pass through
      popupDiv.style.display = 'none'; // Initially hidden
      const h3Elements = popupDiv.querySelectorAll('h3');
      h3Elements.forEach((element) => {
        element.style.color = 'red';
      });
      document.body.appendChild(popupDiv);

      map.current.on('mouseenter', ['neighborhood-fill','quadrant-fill'], (e) => {

        if (e.features.length>1){
          const { name } = e.features[0].properties;
          const { quad } = e.features[1].properties;
  
  
          if (name && quad) {
            popupDiv.innerHTML = `
              
            <div>
            <h3 style="color:white; text-align:center; font-size:15px;">${quad}</h3>
            <p style="color: white; font-size: 13px;">${name}</p>
          </div>
            `;
            popupDiv.style.display = 'block'; // Show the popup
          }
        }

      });

      map.current.on('mousemove', ['neighborhood-fill','quadrant-fill'], (e) => {
        if (e.features.length>1){
          const { name } = e.features[0].properties;
          const { quad } = e.features[1].properties;
  
          
  
          if (name && quad) {
            popupDiv.innerHTML = `
              
            <div>
            <h3 style="color:white; text-align:center; font-size:15px;">${quad}</h3>
            <p style="color: white; font-size: 13px;">${name}</p>
          </div>
            `;
            popupDiv.style.display = 'block'; // Show the popup
          }
        }
        // Update the position of the popup
        const x = e.originalEvent.clientX;
        const y = e.originalEvent.clientY;
        popupDiv.style.left = `${x}px`;
        popupDiv.style.top = `${y}px`;
        popupDiv.style.transform = 'translate(-50%, -140%)';
      });

      map.current.on('mouseleave', ['neighborhood-fill','quadrant-fill'], () => {
        popupDiv.style.display = 'none'; // Hide the popup
      });



    });







    //UPDATE ZOOM AND CENTER OF MAP BASED ON DRAG
      map.current.on('move', () => {
        setZoom(map.current.getZoom().toFixed(2));
      });

      map.current.on('drag', () => {
        const center = map.current.getCenter();
        const newLng = Math.max(-122.43, Math.min(-122.41, center.lng));
        const newLat = Math.max(37.65, Math.min(37.85, center.lat));

        if (center.lng !== newLng || center.lat !== newLat) {
          map.current.setCenter(new mapboxgl.LngLat(newLng, newLat));
        }
      });

        
      setMapLoaded(true);
  },[]);

  useEffect(() => {
    //SECOND USE EFFECT TO UPDATE COLORS WITHOUT RERENDER
    if (map.current && mapLoaded) {
      // toggleParkMarkers(showParks);
      

      updateOpacity(showParks, showCrime);
  

      
      map.current.setPaintProperty('quadrant-fill', 'fill-color', showQuadrantColors
        ? [
            'match',
            ['get', 'quad'],
            'SE', 'lightgreen',
            'SW', 'orange',
            'NE', 'blue',
            'NW', 'red',
            'blue' // Default value if no match
          ]
        : 'blue' // static color fill
      );

    }
  }, [showQuadrantColors, showParks, showCrime, map.current]);





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
        <div className="flex flex-col py-4 px-3">
          <h1 className="text-2xl text-gray-900 font-semibold">Add More Filters</h1>
          <h3 className="text-lg text-gray-600">Continue refining your ideal neighborhoods</h3>
          <div className="flex flex-col border-b-4 border-black">
            <div className="flex my-2">
              <div className="whitespace-nowrap py-2 px-3 border-2 border-gray-300 rounded-lg flex items-center cursor-pointer hover:bg-gray-100 duration-200 mr-2">
                <GrLocation className="w-4 h-4 mx-1"/>Proximity to Location
              </div>
              <div onClick={()=>setShowCrime(!showCrime)}
              className="whitespace-nowrap py-2 px-3 border-2 border-gray-300 rounded-lg flex items-center cursor-pointer hover:bg-gray-100 duration-200">
                <BsShield className="w-4 h-4 mx-1"/>Safety
              </div>
            </div>
            <div className="flex mb-2">
              <div onClick={()=>setShowParks(!showParks)}
                    className="whitespace-nowrap py-2 px-3 border-2 border-gray-300 rounded-lg flex items-center cursor-pointer hover:bg-gray-100 duration-200 mr-2">
                <BsTree className="w-4 h-4 mx-1"/>Parks and Rec Centers
              </div>
              <div className="whitespace-nowrap py-2 px-3 border-2 border-gray-300 rounded-lg flex items-center cursor-pointer hover:bg-gray-100 duration-200">
                <AiOutlineShoppingCart className="w-4 h-4 mx-1"/>Grocery chains
              </div>
            </div>
            <div className="flex mb-2">
              <div className="whitespace-nowrap py-2 px-3 border-2 border-gray-300 rounded-lg flex items-center cursor-pointer hover:bg-gray-100 duration-200 mr-2">
                <BsTrainFront className="w-4 h-4 mx-1"/>BART Stations
              </div>
              <div className="whitespace-nowrap py-2 px-3 border-2 border-gray-300 rounded-lg flex items-center cursor-pointer hover:bg-gray-100 duration-200">
                <PiPersonSimpleBikeBold className="w-4 h-4 mx-1"/>Bikes
              </div>
            </div>
            <div className="flex mb-2">
              <div className="whitespace-nowrap py-2 px-3 border-2 border-gray-200 rounded-lg flex items-center cursor-pointer hover:bg-gray-100 duration-200 mr-2">
                <CiDumbbell className="w-6 h-6 mx-1"/>Gym chains
              </div>
              <div className="whitespace-nowrap py-2 px-3 border-2 border-gray-200 rounded-lg flex items-center cursor-pointer hover:bg-gray-100 duration-200">
                <LiaBusSolid className="w-6 h-6 mx-1"/>Bus stops
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className='text-2xl text-gray-900 font-semibold'>
              Filters
            </h1>
            <h2>

            </h2>
          </div>
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
        
        <div className="absolute bottom-8 right-2 z-10 flex flex-col">
          <button className="text-md font-semibold text-black rounded-md border-2  bg-white hover:bg-gray-200 duration-200 p-1 w-full" onClick={()=>{setShowQuadrantColors(!showQuadrantColors)}}>
            {showQuadrantColors ? "Hide Quadrant Colors" : "Show Quadrant Colors"}
          </button>
      
        </div>
        
        <div ref={mapContainer} className="absolute top-0" style={{ height: '100%', width:"80%" }} />
      </div>

    </div>
  );
};

export default Home;