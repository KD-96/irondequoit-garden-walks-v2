import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import useGardenStore from '../store/gardenStore';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
    Box, Chip, IconButton, Popover, FormGroup, FormControlLabel, Checkbox, Button
} from '@mui/material';
import LayersIcon from '@mui/icons-material/Layers';

import MapLayers from './MapLayers';

mapboxgl.accessToken = 'pk.eyJ1Ijoia2FzdW4wMDEiLCJhIjoiY202bms5b2p3MHgwaTJrcTRmazV4a3k2MyJ9.2fPU4RjLDqtvsiEBdAH3Tw';

const MapComponent = ({ selectedGarden, setSelectedGarden, resetSignal }) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const { gardens, fetchGardens } = useGardenStore();
    const selectedFeatureIdRef = useRef(null);
    const selectedMarkerRef = useRef(null);

    const [isMapReady, setIsMapReady] = useState(false);

    const [layerVisibility, setLayerVisibility] = useState({
        bikeBoulevards: false,
        protectedBikeTrails: false,
    });

    // ⛳️ Hooks should go here
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleToggleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const toggleLayer = (layerKey) => {
        const newVisibility = !layerVisibility[layerKey];
        setLayerVisibility((prev) => ({ ...prev, [layerKey]: newVisibility }));

        const mapboxLayerId = {
            bikeBoulevards: 'bike-boulevards-layer',
            protectedBikeTrails: 'protected-bike-trails-layer',
        }[layerKey];

        if (mapRef.current?.getLayer(mapboxLayerId)) {
            mapRef.current.setLayoutProperty(
                mapboxLayerId,
                'visibility',
                newVisibility ? 'visible' : 'none'
            );
        }
    };

    useEffect(() => {
        if (mapRef.current) return;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/kasun001/cmcfsvrwg000k01r00zb9e7zc',
            center: [-77.620, 43.227],
            zoom: 12,
        });

        mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        mapRef.current.on('load', () => {
            setIsMapReady(true); // Only show layers after map is loaded
        });

        fetchGardens();
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;

        const map = mapRef.current;

        map.flyTo({
            center: [-77.620, 43.227], // ✅ Replace with your actual default center
            zoom: 12,                // ✅ Replace with your actual default zoom
            speed: 1.2,
            curve: 1.4,
            essential: true
        });
    }, [resetSignal]);

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

                // ✅ Only attempt to filter if the layer exists
                if (map.getLayer('selected-garden-circle')) {
                    map.setFilter('selected-garden-circle', ['==', 'mapNumber', '']);
                }

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
                        name: garden.name,
                        group: garden.group
                    },
                })),
        };

        // Add source and layer
        if (mapRef.current.getSource('gardens')) {
            mapRef.current.getSource('gardens').setData(geojson);
        } else {
            mapRef.current.addSource('gardens', {
                type: 'geojson',
                data: geojson,
                cluster: true,
                clusterMaxZoom: 14, // Max zoom to cluster points
                clusterRadius: 20,  // Radius of each cluster (in pixels)
            });

            mapRef.current.addLayer({
                id: 'clusters',
                type: 'circle',
                source: 'gardens',
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': 'black',
                    'circle-radius': [
                        'step',
                        ['get', 'point_count'],
                        10, 3, 14, 12, 18
                    ],
                }
            });

            mapRef.current.addLayer({
                id: 'cluster-count',
                type: 'symbol',
                source: 'gardens',
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': '{point_count_abbreviated}',
                    'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                    'text-size': 12
                },
                paint: {
                    'text-color': '#fff'
                }
            });

            mapRef.current.on('click', 'clusters', (e) => {
                const features = mapRef.current.queryRenderedFeatures(e.point, {
                    layers: ['clusters'],
                });

                const clusterId = features[0].properties.cluster_id;
                const coordinates = features[0].geometry.coordinates;

                mapRef.current.getSource('gardens').getClusterExpansionZoom(
                    clusterId,
                    (err, zoom) => {
                        if (err) return;

                        // 💡 Shift center 150px to the left
                        const point = mapRef.current.project(coordinates);
                        point.x -= 100; // shift left (adjust pixel value as needed)
                        const shiftedLngLat = mapRef.current.unproject(point);

                        mapRef.current.easeTo({
                            center: shiftedLngLat,
                            zoom: zoom,
                            duration: 500,
                        });
                    }
                );
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
                    'text-allow-overlap': false, // ✅ let Mapbox hide overlapping text
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
                filter: ['!', ['has', 'point_count']],
                paint: {
                    // Shrink circles more aggressively at low zoom levels
                    'circle-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        8, 2,      // ✅ dot at zoom 8
                        10, 5,     // smaller than before
                        14, 10,
                        16, 12
                    ],
                    'circle-color': [
                        'match',
                        ['get', 'group'],
                        'Residential', '#00a025',
                        'Community', '#119cff',
                        'Welcome Center', '#ffd415',
                        '#999999'
                    ],
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#fff',
                },
            }, 'garden-points')
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

        // Update filter on highlight circle layer
        if (map.getLayer('selected-garden-circle')) {
            const mapNumber = selectedGarden?.mapNumber ?? '';
            map.setFilter('selected-garden-circle', ['==', 'mapNumber', mapNumber]);
        }

        // ✅ Check and use lngLat properly
        if (selectedGarden?.location?._lat && selectedGarden?.location?._long) {
            const lngLat = [selectedGarden.location._long, selectedGarden.location._lat]; // ✅ FIXED: define lngLat here

            // Fly to the selected garden
            map.flyTo({
                center: lngLat,
                zoom: 20,
                speed: 1.2,
                curve: 1.4,
            });

            // Remove previous pulsing marker
            if (selectedMarkerRef.current) {
                selectedMarkerRef.current.remove();
            }

            // Create new pulsing dot element
            const el = document.createElement('div');
            el.className = 'pulsing-dot';

            // Add the pulsing marker
            selectedMarkerRef.current = new mapboxgl.Marker({ element: el })
                .setLngLat(lngLat)
                .addTo(map);
        } else {
            // Remove pulsing marker if deselected
            if (selectedMarkerRef.current) {
                selectedMarkerRef.current.remove();
                selectedMarkerRef.current = null;
            }
        }
    }, [selectedGarden]);

    return (
        <div ref={mapContainerRef} className="mapbox-map">
            {isMapReady && <MapLayers map={mapRef.current} />}

            <Button
                onClick={handleToggleMenu}
                sx={{
                    width: '100px',
                    position: 'absolute',
                    top: 105,
                    right: 5,
                    zIndex: 10,
                    bgcolor: 'white',
                    color: '#7f7f7f',
                    boxShadow: 1,
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    '&:hover': {
                        bgcolor: '#ebebeb',
                    },
                }}
                title="Toggle layers"
            >
                <LayersIcon /> Layers
            </Button>

            {/* 🌐 Popover for layer toggles */}
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <FormGroup sx={{ p: 2 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={layerVisibility.bikeBoulevards}
                                onChange={() => toggleLayer('bikeBoulevards')}
                            />
                        }
                        label="Bike Boulevards"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={layerVisibility.protectedBikeTrails}
                                onChange={() => toggleLayer('protectedBikeTrails')}
                            />
                        }
                        label="Protected Bike Trails"
                    />
                </FormGroup>
            </Popover>
        </div >
    );
};

export default MapComponent;
