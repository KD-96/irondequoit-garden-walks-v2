import React from 'react';
import {
    Typography, Autocomplete, TextField, Box, OutlinedInput,
    InputLabel, MenuItem, FormControl, Select, Chip, IconButton, List,
    ListItemText, ListItemAvatar, Avatar, ListItemButton, Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TuneIcon from '@mui/icons-material/Tune';

import gardenTypes from '../assets/data/GardenTypes';

function getStyles(name, selected, theme) {
    return {
        fontWeight: selected.includes(name)
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular,
    };
}

const SidePanel = () => {
    const theme = useTheme();
    const [selectedTypes, setSelectedTypes] = React.useState([]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedTypes(typeof value === 'string' ? value.split(',') : value);
    };

    return (

        <div className='side-panel-content'>
            <Box sx={{ pl: 2, pr: 2 }}>
                {/* Title */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h5" fontWeight={600}>
                        Garden List
                    </Typography>
                </Box>

                {/* Search Bar */}
                <Box sx={{ mb: 2 }}>
                    <Autocomplete
                        fullWidth
                        size="small"
                        disablePortal
                        options={[]} // Replace with real garden name list
                        renderInput={(params) => <TextField {...params} label="Search Gardens" />}
                    />
                </Box>

                {/* Filter Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="garden-type-filter-label">Filter by Types</InputLabel>
                        <Select
                            labelId="garden-type-filter-label"
                            id="garden-type-filter"
                            multiple
                            value={selectedTypes}
                            onChange={handleChange}
                            input={<OutlinedInput label="Garden Types" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            )}
                        >
                            {gardenTypes.map((name) => (
                                <MenuItem key={name} value={name} style={getStyles(name, selectedTypes, theme)}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <IconButton size="small" color="primary">
                        <TuneIcon />
                    </IconButton>
                </Box>
            </Box>

            <div className='s-p-garden-list'>
                {/* Garden List */}
                <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                        <React.Fragment key={item}>
                            <ListItemButton alignItems="flex-start" sx={{ borderRadius: 2 }}>
                                <ListItemAvatar>
                                    <Avatar alt="Garden" src="/static/images/avatar/1.jpg" />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`Garden Name ${item}`}
                                    secondary={
                                        <Typography component="span" variant="body2" color="text.primary">
                                            Garden Address, Line, Here.
                                        </Typography>
                                    }
                                />
                            </ListItemButton>
                            {item !== 10 && <Divider variant="inset" component="li" />}
                        </React.Fragment>
                    ))}
                </List>
            </div>
        </div>
    );
};

export default SidePanel;
