import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
// import { useGardenStore } from '../store/gardenStore'; 
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoia2FzdW4wMDEiLCJhIjoiY202bms5b2p3MHgwaTJrcTRmazV4a3k2MyJ9.2fPU4RjLDqtvsiEBdAH3Tw';

const MapComponent = () => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    // const gardens = useGardenStore((state) => state.gardens); 

    useEffect(() => {
        if (mapRef.current) return; // Initialize only once

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12', // you can change style here
            center: [-77.581, 43.217], // Default to Irondequoit area
            zoom: 12,
        });

        mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    }, []);

    return (
        <div ref={mapContainerRef} className='mapbox-map' />
    );
};

export default MapComponent;
