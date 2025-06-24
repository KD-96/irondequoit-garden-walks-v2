import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import useGardenStore from '../store/gardenStore';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoia2FzdW4wMDEiLCJhIjoiY202bms5b2p3MHgwaTJrcTRmazV4a3k2MyJ9.2fPU4RjLDqtvsiEBdAH3Tw';

const MapComponent = ({ selectedGarden, setSelectedGarden }) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const { gardens, fetchGardens } = useGardenStore();
    const selectedFeatureIdRef = useRef(null);

    useEffect(() => {
        if (mapRef.current) return;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-77.581, 43.217],
            zoom: 12,
        });

        mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        fetchGardens();
    }, []);

    useEffect(() => {
        if (!mapRef.current || !gardens.length) return;

        console.log(selectedGarden);

        const map = mapRef.current;
        const popupRef = new mapboxgl.Popup({ closeOnClick: true });

        // Click handler
        const handleClick = (e) => {
            const feature = e.features[0];
            const coordinates = feature.geometry.coordinates.slice();
            const { mapNumber } = feature.properties;

            const garden = gardens.find((g) => g.mapNumber === Number(mapNumber));
            if (!garden) return;

            // Zoom to the feature
            map.flyTo({ center: coordinates, zoom: 14 });

            // Show popup
            popupRef
                .setLngLat(coordinates)
                .setHTML(`<strong>${garden.name || `Garden #${mapNumber}`}</strong>`)
                .addTo(map);

            // ✅ Set selected garden
            setSelectedGarden(garden);

            // ✅ Highlight circle filter (if used)
            if (map.getLayer('selected-garden-circle')) {
                map.setFilter('selected-garden-circle', ['==', 'mapNumber', mapNumber]);
            }
        };

        // Set listener on circle layer
        map.on('click', 'garden-circles', handleClick);

        map.on('click', (e) => {
            const features = map.queryRenderedFeatures(e.point, {
                layers: ['garden-circles'],
            });

            if (features.length === 0) {
                selectedFeatureIdRef.current = null;
                map.setFilter('selected-garden-circle', ['==', 'mapNumber', '']);
                popupRef.remove();
            }
        });


        // Change cursor style on hover
        map.on('mouseenter', 'garden-circles', () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'garden-circles', () => {
            map.getCanvas().style.cursor = '';
        });

        // Convert gardens to GeoJSON
        const geojson = {
            type: 'FeatureCollection',
            features: gardens
                .filter(g => g.location?._lat && g.location?._long)
                .map(garden => ({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [garden.location._long, garden.location._lat],
                    },
                    properties: {
                        mapNumber: garden.mapNumber,
                        name: garden.name
                    },
                })),
        };

        const sourceExists = map.getSource('gardens');
        const highlightLayerExists = map.getLayer('selected-garden-circle');

        if (sourceExists && !highlightLayerExists) {
            map.addLayer({
                id: 'selected-garden-circle',
                type: 'circle',
                source: 'gardens',
                paint: {
                    'circle-radius': 16,
                    'circle-color': '#FFD700',
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#000',
                },
                filter: ['==', 'mapNumber', ''],
            });
        }

        // Add source and layer
        if (mapRef.current.getSource('gardens')) {
            mapRef.current.getSource('gardens').setData(geojson);
        } else {
            mapRef.current.addSource('gardens', {
                type: 'geojson',
                data: geojson,
            });

            mapRef.current.addLayer({
                id: 'garden-points',
                type: 'symbol',
                source: 'gardens',
                layout: {
                    'text-field': ['get', 'mapNumber'],
                    'text-size': 12,
                    'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                    'text-offset': [0, -0.65],
                    'text-anchor': 'top',
                },
                paint: {
                    'text-color': '#fff',
                    'text-halo-color': '#3e8448',
                    'text-halo-width': 2,
                },
            });

            // Add background circle (separate layer if needed)
            mapRef.current.addLayer({
                id: 'garden-circles',
                type: 'circle',
                source: 'gardens',
                paint: {
                    'circle-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        9, 4,
                        10, 6,
                        12, 12,
                        15, 16
                    ],
                    'circle-color': '#3e8448',
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#fff',
                },
            }, 'garden-points'); // Add below text
        }

        // Cleanup
        return () => {
            map.off('click', 'garden-circles', handleClick);
            popupRef.remove();
        };
    }, [gardens, selectedGarden]);

    useEffect(() => {
        if (!mapRef.current) return;

        const map = mapRef.current;

        if (map.getLayer('selected-garden-circle')) {
            const mapNumber = selectedGarden?.mapNumber ?? '';
            map.setFilter('selected-garden-circle', ['==', 'mapNumber', mapNumber]);
        }

        if (selectedGarden?.location?._lat && selectedGarden?.location?._long) {
            map.flyTo({
                center: [selectedGarden.location._long, selectedGarden.location._lat],
                zoom: 14, // You can adjust zoom level
                speed: 1.2,
                curve: 1.4,
            });
        }
    }, [selectedGarden]);

    return (
        <div ref={mapContainerRef} className="mapbox-map" />
    );
};

export default MapComponent;
