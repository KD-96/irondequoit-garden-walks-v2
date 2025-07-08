// components/MapKey.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import gardenTypeIcons from '../utils/gardenTypeIcons';

const groupLegend = [
    { label: 'Residential Garden', color: '#00a025' },
    { label: 'Community Garden', color: '#119cff' },
    { label: 'Welcome Center', color: '#ffd415' },
];

const typeLegend = [
    { key: 'Vegetable/ Fruit', label: 'Vegetable/ Fruit Garden' },
    { key: 'Water Feature', label: 'Water Feature' },
    { key: 'Wheelchair/ Stroller', label: 'Accessible' },
    { key: 'Pollinator/ Native', label: 'Pollinator/ Native' },
    { key: 'Art/ Sculpture', label: 'Art/ Sculpture' },
];

const MapKey = () => {
    return (
        <Box className="map-key-box">
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Map Key
            </Typography>

            {/* Group Legend */}
            {/* {groupLegend.map(({ label, color }) => (
                <Box key={label} className="map-key-item">
                    <Box className="map-key-icon" sx={{ backgroundColor: color, borderRadius: 2 }} />
                    <Typography variant="body2">{label}</Typography>
                </Box>
            ))} */}

            {/* Divider (optional) */}
            <Box sx={{ my: 1, borderTop: '1px solid #ccc' }} />

            {/* Type Legend */}
            {typeLegend.map(({ key, label }) => (
                <Box key={key} className="map-key-item">
                    <Box className="map-key-icon">
                        {gardenTypeIcons[key] || gardenTypeIcons.default}
                    </Box>
                    <Typography variant="body2">{label}</Typography>
                </Box>
            ))}
        </Box>
    );
};

export default MapKey;
