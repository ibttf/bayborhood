import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import '../styles/animations.css';
import logo from "../styles/logo.png"
import {BsShield, BsTree,BsTrainFront} from "react-icons/bs"
import {GrLocation} from "react-icons/gr"
import {AiOutlineShoppingCart} from "react-icons/ai"
import {PiPersonSimpleBikeBold} from "react-icons/pi"
import {CiDumbbell} from "react-icons/ci"
import {SearchBox} from '@mapbox/search-js-react';


mapboxgl.accessToken = process.env.REACT_APP_TOKEN;

const Home = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const locationMarker=useRef(null);
  const wholeFoodsMarkersRef = useRef([]); // ref to store Whole Foods markers
  const traderJoesMarkersRef = useRef([]); // ref to store Trader Joe's markers
  const gymMarkersRef = useRef([]); // ref to store Gym markers

  const [mapLoaded, setMapLoaded] = useState(false);

  const [lng, setLng] = useState(-122.42);
  const [lat, setLat] = useState(37.75);
  const [zoom, setZoom] = useState(11);

  const [showInfo,setShowInfo]=useState(false);
  
  const [showQuadrantColors,setShowQuadrantColors]=useState(false)
  const [showParks,setShowParks]=useState(false);
  const [showCrime,setShowCrime]=useState(false);
  const [showLocation,setShowLocation]=useState(false);
    const [locationLatLong,setLocationLatLong]=useState(null)
    const [locationName,setLocationName]=useState("")
  const [showGrocery,setShowGrocery]=useState(false);
  //groceries
    const [traderJoes,setTraderJoes]=useState(false);
    const [wholeFoods,setWholeFoods]=useState(false);

  const [showBart,setShowBart]=useState(false);
    const [bartMode,setBartMode]=useState("Walking")
  const [showBikes,setShowBikes]=useState(false);
  const [showGyms,setShowGyms]=useState(false);


  const removeAllMarkers = (markerRef) => {
    markerRef.current.forEach(marker => {
      marker.remove();
    });
    markerRef.current.length = 0; // Clear the ref array
  }
  
  
  const showMarkers = () => {
    if (!map.current) return;
  
    if (wholeFoods){
      fetch("/static/media/whole_foods_coordinates.d68ad5a5432e91d044e4.geojson")
        .then(r => r.json())
        .then(data => {
          removeAllMarkers(wholeFoodsMarkersRef);
          data.features.forEach(feature => {
            const coordinates = feature.geometry.coordinates;
            const marker = new mapboxgl.Marker({ color: 'red' })
              .setLngLat(coordinates)
              .addTo(map.current);
            wholeFoodsMarkersRef.current.push(marker);
          });
        })
        .catch(error => {
          console.error("There was an issue loading the Whole Foods data:", error);
        });
    } else {
      removeAllMarkers(wholeFoodsMarkersRef);
    }
  
    if (traderJoes){
      fetch("/static/media/trader_joes_coordinates.b7930c96fbd1e2811b32.geojson")
        .then(r => r.json())
        .then(data => {
          removeAllMarkers(traderJoesMarkersRef);
          data.features.forEach(feature => {
            const coordinates = feature.geometry.coordinates;
            const marker = new mapboxgl.Marker({ color: 'blue' })
              .setLngLat(coordinates)
              .addTo(map.current);
            traderJoesMarkersRef.current.push(marker);
          });
        })
        .catch(error => {
          console.error("There was an issue loading the Trader Joe's data:", error);
        });
    } else {
      removeAllMarkers(traderJoesMarkersRef);
    }
    if (showGyms) {
      const gyms=require('../data/gym_coordinates.geojson')
      console.log(gyms)
      fetch("/static/media/gym_coordinates.e039c3ed6528dac26057.geojson")
        .then(r => r.json())
        .then(data => {
          removeAllMarkers(gymMarkersRef);
          data.features.forEach(feature => {

            const coordinates = feature.geometry.coordinates;
  
            // Create a popup with the gym's name
            const popup = new mapboxgl.Popup({ offset: 25 })
              .setText(feature.properties.name); // Assuming the name is stored in the 'name' property
  
            // Create the marker and bind the popup to it
            const marker = new mapboxgl.Marker({ color: 'green' })
              .setLngLat(coordinates)
              .setPopup(popup) // Bind the popup to the marker
              .addTo(map.current);
  
            // Add a hover event to show the popup
            marker.getElement().addEventListener('mouseenter', () => marker.togglePopup());
            marker.getElement().addEventListener('mouseleave', () => marker.togglePopup());
  
            gymMarkersRef.current.push(marker);
          });
        })
        .catch(error => {
          console.error("There was an issue loading the gym data:", error);
        });
    } else {
      removeAllMarkers(gymMarkersRef);
    }
  }
  
  
  
  

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
    // Add bike_score based opacity if showBikes is true
    if (showBikes) {
      opacityExpression = ['-', opacityExpression, ['*', ['get', 'bike_score'], 0.1]];
    }
    if (wholeFoods) {
      opacityExpression = ['-', opacityExpression, ['*', ['get', 'whole_foods_score'], 0.1]];
    }
    if (traderJoes) {
      opacityExpression = ['-', opacityExpression, ['*', ['get', 'trader_joes_score'], 0.1]];
    }
    if (showGyms) {
      opacityExpression = ['-', opacityExpression, ['*', ['get', 'gym_score'], 0.1]];
    }


  
    // Ensure opacity doesn't exceed 1
    opacityExpression = ['min', 1, opacityExpression];
  
    // Set the calculated opacity expression to the 'quadrant-fill' layer
    map.current.setPaintProperty('quadrant-fill', 'fill-opacity', opacityExpression);
  };




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
          'fill-color': 'transparent',
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
          'fill-color': 'rgba(0,51,204,0.7)'
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






//SECOND USE EFFECT TO UPDATE THINGS WITHOUT RERENDER

  useEffect(() => {
    if (map.current && mapLoaded) {
    
      updateOpacity();
      showMarkers();

      
      map.current.setPaintProperty('quadrant-fill', 'fill-color', showQuadrantColors
      ? [
          'match',
          ['get', 'quad'],
          'SE', 'rgba(144, 238, 144, 0.7)', // lightgreen with 0.7 opacity
          'SW', 'rgba(255, 165, 0, 0.7)',    // orange with 0.7 opacity
          'NE', 'rgba(0,51,204,0.7)',  // blue with 0.7 opacity
          'NW', 'rgba(255, 0, 0, 0.7)',      // red with 0.7 opacity
          'rgba(0,51,204,0.7)'         // Default value if no match, blue with 0.7 opacity
        ]
      : 'rgba(0,51,204,0.7)' // static color fill with 0.7 opacity
    );

      if (locationLatLong) {
        // Remove existing marker if any
        if (locationMarker.current) {
          locationMarker.current.remove();
        }
      
        // Create a new marker at the location
        locationMarker.current = new mapboxgl.Marker()
          .setLngLat(locationLatLong)
          .addTo(map.current);
      }
      }

      

  }, [showQuadrantColors, showParks, showCrime, showBikes, locationLatLong, wholeFoods, traderJoes, showGyms, map.current]);





  const handleZoomIn = () => {
    map.current.zoomTo(map.current.getZoom() + 1, { duration: 200 });
  };

  const handleZoomOut = () => {
    map.current.zoomTo(map.current.getZoom() - 1, { duration: 200 });
  };


  return (
    <>
    <div className={`${showInfo ? " opacity-50" : "opactiy-100"}  bg-white flex h-screen w-screen overflow-hidden`} onClick={()=>setShowInfo(false)}>
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
                  style={{fontSize:"12px"}} onClick={(e)=>{
                    e.stopPropagation()
                    setShowInfo(true)
                    }}>i</p>
        </div>
        <div>

        </div>
        <div className="flex flex-col py-4 px-3">
          <h1 className="text-2xl text-gray-900 font-semibold">Add More Filters</h1>
          <h3 className="text-lg text-gray-600">Continue refining your ideal neighborhoods</h3>
          <div className="flex flex-col border-b-4 border-blue-900">
            <div className="flex my-2">
              <div onClick={()=>setShowLocation(true)}
                className={`w-fit whitespace-nowrap py-2 px-3 border-2 border-gray-300 ${showLocation ? "bg-gray-100 cursor-not-allowed opacity-50" : "opacity-100 hover:bg-gray-100 bg-white cursor-pointer"} rounded-lg flex items-center   duration-200 mr-2`}>
                <GrLocation className="w-4 h-4 mx-1"/>Proximity to Location
              </div>
              <div onClick={()=>setShowCrime(true)}
              className={`w-fit whitespace-nowrap py-2 px-3 border-2 border-gray-300 ${showCrime ? "bg-gray-100 cursor-not-allowed opacity-50" : "opacity-100 hover:bg-gray-100 bg-white cursor-pointer"} rounded-lg flex items-center   duration-200`}>
                <BsShield className="w-4 h-4 mx-1"/>Safety
              </div>
            </div>
            <div className="flex mb-2">
              <div onClick={()=>setShowParks(true)}
                className={`w-fit whitespace-nowrap py-2 px-3 border-2 border-gray-300 ${showParks ? "bg-gray-100 cursor-not-allowed opacity-50" : "opacity-100 hover:bg-gray-100 bg-white cursor-pointer"} rounded-lg flex items-center   duration-200 mr-2`}>
                <BsTree className="w-4 h-4 mx-1"/>Parks and Rec Centers
              </div>
              <div onClick={()=>setShowGrocery(true)}
              className={`w-fit whitespace-nowrap py-2 px-3 border-2 border-gray-300 ${showGrocery ? "bg-gray-100 cursor-not-allowed opacity-50" : "opacity-100 hover:bg-gray-100 bg-white cursor-pointer"} rounded-lg flex items-center   duration-200`}>
                <AiOutlineShoppingCart className="w-4 h-4 mx-1"/>Grocery Chains
              </div>
            </div>
            <div className="flex mb-2">
              <div onClick={()=>setShowBart(true)}
                className={`w-fit whitespace-nowrap py-2 px-3 border-2 border-gray-300 ${showBart ? "bg-gray-100 cursor-not-allowed opacity-50" : "opacity-100 hover:bg-gray-100 bg-white cursor-pointer"} rounded-lg flex items-center   duration-200 mr-2`}>
                <BsTrainFront className="w-4 h-4 mx-1"/>BART Stations
              </div>
              <div onClick={()=>setShowBikes(true)}
              className={`w-fit whitespace-nowrap py-2 px-3 border-2 border-gray-300 ${showBikes ? "bg-gray-100 cursor-not-allowed opacity-50" : "opacity-100 hover:bg-gray-100 bg-white cursor-pointer"} rounded-lg flex items-center   duration-200`}>
                <PiPersonSimpleBikeBold className="w-4 h-4 mx-1"/>BikeShare
              </div>
            </div>
            <div className="flex mb-2">
              <div onClick={()=>setShowGyms(true)}
                className={`w-fit whitespace-nowrap py-2 px-3 border-2 border-gray-300 ${showGyms ? "bg-gray-100 cursor-not-allowed opacity-50" : "opacity-100 hover:bg-gray-100 bg-white cursor-pointer"} rounded-lg flex items-center   duration-200 mr-2`}>
                <CiDumbbell className="w-4 h-4 mx-1"/>Gym Chains
              </div>

            </div>
          </div>
          <div className="flex flex-col">
            <h1 className='text-2xl text-gray-900 font-semibold'>
              Filters
            </h1>
            <h2 className="text-gray-600">
              Hold and drag here to delete
            </h2>
            <div>
              {displayActiveFilters()}
            </div>
          </div>
        </div>
        
      </div>
      <div className="" style={{width: "100%"}}>
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
        
        <div ref={mapContainer} className="top-0 h-full w-full" />
      </div>

    </div>
    {
      showInfo ? 
      <div className="absolute opacity-100 h-full w-full top-0 left-0 right-0 mx-auto my-36" style={{width:"80vw"}}>
          <div class="text-sm bg-white pb-16 px-8 rounded-sm">
            <h1 className="text-3xl font-semibold text-center py-6">
              About
            </h1>
            <div class="text-lg mb-1">
              <b>How does Bayborhood work?</b>
            </div>
            Bayborhood helps you discover suitable neighborhoods in San Francisco, based on your preferences.
            <ul class="list-decimal ml-6">
              <li class="mt-1">
                <b>Adding Filters</b>: From the left sidebar, add filters to narrow down your search. You can also click on some filters to fine-tune your preferences.</li>
                <li class="mt-1"><b>View Map</b>: The map is interactive and will update as you add filters. Darker areas indicate higher alignment with your preferences. You can hover over a neighborhood to see its name and the quadrant it's in.</li>
                <li class="mt-1"><b>See Quadrants</b>: On the bottom right, toggle "See Quadrants" to color-coordinate the map to color every neighborhood separately by their quadrant.</li>
              </ul>
              <div class="text-lg mt-4 mb-1"><b>Where do you get the data?</b>
              </div>We source our data from several public datasets, and apply additional processing to aggregate the disparate datasets into a convenient and accessible format.
              <ul class="ml-6 list-disc">
                <li class="mt-1"><b>Neighborhoods and Quadrants</b>: 2022 Neighborhood Analysis  <a href="https://data.sfgov.org/" target="_blank" rel="noreferrer" class="text-blue-500 underline">DataSF</a></li>
                <li class="mt-1"><b>Proximity to Specific Locations</b>: <a href="https://docs.microsoft.com/en-us/bingmaps/rest-services/routes/calculate-an-isochrone" target="_blank" rel="noreferrer" class="text-blue-500 underline">Bing Maps Isochrone API</a> (includes transit data)</li>
                <li class="mt-1"><b>Grocery Chains and Gyms</b>: <a href="https://developer.foursquare.com/docs/places-api-overview" target="_blank" rel="noreferrer" class="text-blue-500 underline">Foursquare Places API</a></li>
                <li class="mt-1"><b>Parks and Rec Centers</b>: <a href="https://data.sfgov.org/" target="_blank" rel="noreferrer" class="text-blue-500 underline">Data SF</a></li>
                <li class="mt-1"><b>BikeShare</b>: <a href="" target="_blank" rel="noreferrer" class="text-blue-500 underline">Lyft API</a></li>
                <li class="mt-1"><b>BART Stations</b>: <a href="https://www.bart.gov/schedules/developers/api" target="_blank" rel="noreferrer" class="text-blue-500 underline">BART API</a></li>
                <li class="mt-1"><b>Safety</b>: <a href="" target="_blank" rel="noreferrer" class="text-blue-500 underline">Data SF</a></li>
                {/* <li class="mt-1"><b>Housing Prices</b>: <a href="" target="_blank" rel="noreferrer" class="text-blue-500 underline">Streeteasy Data Dashboard</a></li> */}
              </ul>
              </div>
        
      </div>
      :
      <></>
    }
    </>
  );

  function displayActiveFilters(){
    return (
    <div className="flex flex-col border-b-4 border-blue-900">
        {
          showLocation ?
            <div onClick={()=>setShowLocation(false)}
              className={`w-full whitespace-nowrap  rounded-lg flex flex-col duration-200 mr-2 cursor-pointer`}>
               
               <div className="flex items-center">
               <GrLocation className="w-4 h-4 mx-1"/>Proximity to Location
                </div>
               <div  onClick={(e)=>e.stopPropagation()} className="">
                  <SearchBox accessToken={process.env.REACT_APP_TOKEN} 
                            placeholder="Search"
                            value={locationName.length>0 ? locationName : ""}
                            bbox={[-122.537384,37.702566,-122.353363,37.810055]}
                            onRetrieve={(e)=>{
                                      setLocationName(e.features[0].properties.name)
                                      setLocationLatLong(e.features[0].geometry.coordinates)}}
                            className=""/>
                </div>
            </div>
          :
            <></>
        }
        {
          showCrime ?
            <div onClick={()=>setShowCrime(false)}
              className={`w-full whitespace-nowrap  rounded-lg flex items-center duration-200 mr-2 cursor-pointer`}>
              <BsShield className="w-4 h-4 mx-1"/>Safety
            </div>
          :
            <></>
        }
        {
          showParks ?
            <div onClick={()=>setShowParks(false)}
              className={`w-full whitespace-nowrap  rounded-lg flex items-center duration-200 mr-2 cursor-pointer`}>
              <BsTree className="w-4 h-4 mx-1"/>Parks and Rec Centers
            </div>
          :
            <></>
        }
        {
          showGrocery ?
            <div onClick={()=>{
                setShowGrocery(false);
                setWholeFoods(false)
                setTraderJoes(false)}}
              className={`w-full whitespace-nowrap  rounded-lg flex flex-col duration-200 mr-2 cursor-pointer`}>
               
               <div className="flex items-center">
                <AiOutlineShoppingCart className="w-4 h-4 mx-1"/>Grocery Chains
                </div>
               <div className="grid grid-cols-2 gap-2">
                  <div onClick={(e)=>{e.stopPropagation()
                                      setTraderJoes(!traderJoes)}} 
                      className={`${traderJoes ? "bg-blue-500 border-blue-200" : "bg-white border-gray-500" } duration-100 text-center border-2 rounded-lg px-2 py-1 cursor-pointer`}>
                    Trader Joe's
                  </div>
                  <div onClick={(e)=>{e.stopPropagation()
                                      e.preventDefault()
                                      setWholeFoods(!wholeFoods)}} 
                      className={`${wholeFoods ? "bg-blue-500 border-blue-200" : "bg-white border-gray-500" } duration-100 text-center border-2 rounded-lg px-2 py-1 cursor-pointer`}>
                    Whole Foods
                  </div>
                </div>
            </div>
          :
            <></>
        }
        {
          showBart ?
            <div onClick={()=>setShowBart(false)}
              className={`w-full whitespace-nowrap  rounded-lg flex flex-col duration-200 mr-2 cursor-pointer`}>
               
               <div className="flex items-center">
               <BsTrainFront className="w-4 h-4 mx-1"/>BART Stations
                </div>
                <h4 className="text-sm text-gray-600">
                  Walking or transit?
                </h4>
               <div className="grid grid-cols-3 gap-2">
                  <div onClick={(e)=>{e.stopPropagation()
                                      setBartMode("Walking")}} 
                      className={`${bartMode=="Walking" ? "bg-blue-500 border-blue-200" : "bg-white border-gray-500" } duration-100 text-center border-2 rounded-lg px-2 py-1 cursor-pointer`}>
                    Walking
                  </div>
                  <div onClick={(e)=>{e.stopPropagation()
                                      setBartMode("Transit")}} 
                      className={`${bartMode=="Transit" ? "bg-blue-500 border-blue-200" : "bg-white border-gray-500" } duration-100 text-center border-2 rounded-lg px-2 py-1 cursor-pointer`}>
                    Transit
                  </div>
                </div>
            </div>
          :
            <></>
        }
        {
          showGyms ?
            <div onClick={()=>setShowGyms(false)}
              className={`w-full whitespace-nowrap  rounded-lg flex flex-col duration-200 mr-2 cursor-pointer`}>
               
               <div className="flex items-center">
               <CiDumbbell className="w-4 h-4 mx-1"/>Gym Chains
                </div>
            </div>
          :
            <></>
        }
        {
          showBikes ?
            <div onClick={()=>setShowBikes(false)}
              className={`w-full whitespace-nowrap  rounded-lg flex items-center duration-200 mr-2 cursor-pointer`}>
                <PiPersonSimpleBikeBold className="w-4 h-4 mx-1"/>BikeShare
            </div>
          :
            <></>
        }


    </div>
    
    )
    
  }
  
};

export default Home;