import { useEffect } from 'react';

const MapLayers = ({ map }) => {
    useEffect(() => {
        if (!map) return;

        // Neighborhoods
        const neighborhoodSourceId = 'neighborhoods-source';
        const neighborhoodLayerId = 'neighborhoods-layer';

        // Bike Boulevards
        const bikeSourceId = 'bike-boulevards';
        const bikeLayerId = 'bike-boulevards-layer';

        // Protected Bike Trails
        const pBikeSourceId = 'protected-bike-trails';
        const pBikeLayerId = 'protected-bike-trails-layer';

        // Add sources
        if (!map.getSource(neighborhoodSourceId)) {
            map.addSource(neighborhoodSourceId, {
                type: 'vector',
                url: 'mapbox://kasun001.cmcbu5vaz00191oo77ujgdhmv-32do0',
            });
        }

        if (!map.getSource(bikeSourceId)) {
            map.addSource(bikeSourceId, {
                type: 'vector',
                url: 'mapbox://kasun001.cmcbyze5u02vh1nqmjq3kfid1-5eye4',
            });
        }

        if (!map.getSource(pBikeSourceId)) {
            map.addSource(pBikeSourceId, {
                type: 'vector',
                url: 'mapbox://kasun001.cmcc2jwla005s1ppkxiqtorhd-53ecm',
            });
        }

        const roadLabelLayerId = map.getStyle().layers.find(
            (layer) => layer.type === 'symbol' && layer.id.includes('road')
        )?.id;

        const insertBelowLayer = roadLabelLayerId || 'garden-circles';

        // Add bike boulevards line layer
        if (!map.getLayer(bikeLayerId)) {
            map.addLayer({
                id: bikeLayerId,
                type: 'line',
                source: bikeSourceId,
                'source-layer': 'bike_boulevards',
                layout: {
                    visibility: 'visible',
                },
                paint: {
                    'line-color': '#1990ff',
                    'line-width': 4,
                },
            }, insertBelowLayer);
        }

        // Add protected bike trails layer
        if (!map.getLayer(pBikeLayerId)) {
            map.addLayer({
                id: pBikeLayerId,
                type: 'line',
                source: pBikeSourceId,
                'source-layer': 'protected_bike_trails',
                layout: {
                    visibility: 'visible',
                },
                paint: {
                    'line-color': '#009d51',
                    'line-width': 4,
                },
            }, insertBelowLayer);
        }

        // Insert neighborhoods fill layer beneath first symbol layer
        const firstSymbolLayerId = map.getStyle().layers.find(l => l.type === 'symbol')?.id;

        if (!map.getLayer(neighborhoodLayerId)) {
            map.addLayer({
                id: neighborhoodLayerId,
                type: 'line', // 👈 use line type for outlines
                source: neighborhoodSourceId,
                'source-layer': 'neighborhoods',
                layout: {
                    visibility: 'visible',
                },
                paint: {
                    'line-color': '#6b8b4e',   // 👈 outline color
                    'line-width': 1,           // 👈 outline thickness
                },
            }, 'bike-boulevards-layer');
        }

        // Cleanup
        return () => {
            // Remove layers
            if (map.getLayer(neighborhoodLayerId)) map.removeLayer(neighborhoodLayerId);
            if (map.getLayer(bikeLayerId)) map.removeLayer(bikeLayerId);
            if (map.getLayer(pBikeLayerId)) map.removeLayer(pBikeLayerId);

            // Remove sources
            if (map.getSource(neighborhoodSourceId)) map.removeSource(neighborhoodSourceId);
            if (map.getSource(bikeSourceId)) map.removeSource(bikeSourceId);
            if (map.getSource(pBikeSourceId)) map.removeSource(pBikeSourceId);
            ;
        };
    }, [map]);

    return null;
};

export default MapLayers;
