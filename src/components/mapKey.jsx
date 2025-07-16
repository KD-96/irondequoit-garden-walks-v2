// components/MapKey.jsx
import React, { useState } from 'react';
import { Box, Typography, IconButton, Paper, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info'; // used for reopen
import gardenTypeIcons from '../utils/gardenTypeIcons';

const groupLegend = [
    { label: 'Residential Garden', color: '#00a025' },
    { label: 'Community Garden', color: '#119cff' },
    { label: 'Welcome Center', color: '#ffd415' },
];

const typeLegend = [
    { key: 'Vegetable / Fruit', label: 'Vegetable / Fruit Garden' },
    { key: 'Water Feature', label: 'Water Feature' },
    { key: 'Wheelchair / Stroller', label: 'Accessible' },
    { key: 'Pollinator / Native', label: 'Pollinator / Native' },
    { key: 'Art / Sculpture', label: 'Art / Sculpture' },
];

const MapKey = () => {
    const [visible, setVisible] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (!visible) {
        return (
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 10,
                    left: isMobile ? 'calc(100% + 190px)' : 10,
                    zIndex: 15,
                }}
            >
                <Tooltip title="Show Map Key">
                    <IconButton
                        onClick={() => setVisible(true)}

                        sx={{
                            bgcolor: 'white',
                            boxShadow: 1,
                            '&:hover': { bgcolor: '#f5f5f5' },
                            scale: 1.5
                        }}
                    >
                        <InfoIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        );
    }

    return (
        <Paper
            elevation={4}
            className="map-key-box"
            sx={{
                position: 'absolute',
                bottom: 10,
                left: 10,
                zIndex: 15,
                width: 240,
                fontFamily: 'Roboto, sans-serif',
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" fontWeight={600}>
                    Map Key
                </Typography>
                <IconButton size="small" onClick={() => setVisible(false)}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* Group Legend */}
            {groupLegend.map(({ label, color }) => (
                <Box key={label} className="map-key-item" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Box sx={{ width: 14, height: 14, borderRadius: 2, backgroundColor: color }} />
                    <Typography variant="body2">{label}</Typography>
                </Box>
            ))}

            {/* Divider */}
            <Box sx={{ my: 1, borderTop: '1px solid #ccc' }} />

            {/* Type Legend */}
            {typeLegend.map(({ key, label }) => (
                <Box key={key} className="map-key-item" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Box className="map-key-icon">
                        {gardenTypeIcons[key] || gardenTypeIcons.default}
                    </Box>
                    <Typography variant="body2">{label}</Typography>
                </Box>
            ))}
        </Paper>
    );
};

export default MapKey;
