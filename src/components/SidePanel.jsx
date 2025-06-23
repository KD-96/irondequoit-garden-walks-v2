import React from 'react';
import { useEffect } from 'react';

import {
    Typography, Autocomplete, TextField, Box, OutlinedInput,
    InputLabel, MenuItem, FormControl, Select, Chip, IconButton, List,
    ListItemText, ListItemAvatar, Avatar, ListItemButton, Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TuneIcon from '@mui/icons-material/Tune';

import gardenTypes from '../assets/data/GardenTypes';
import useGardenStore from '../store/gardenStore';

const SidePanel = () => {
    const theme = useTheme();
    const [selectedTypes, setSelectedTypes] = React.useState([]);
    const [selectedGardenId, setSelectedGardenId] = React.useState(null);
    const gardenRefs = React.useRef({});

    const { gardens, fetchGardens } = useGardenStore();
    const [gardenTypeOptions, setGardenTypeOptions] = React.useState([]);
    const [filteredGardens, setFilteredGardens] = React.useState([]);

    useEffect(() => {
        if (selectedGardenId && gardenRefs.current[selectedGardenId]) {
            gardenRefs.current[selectedGardenId].scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [selectedGardenId]);

    useEffect(() => {
        const loadGardens = async () => {
            await fetchGardens();

            const { gardens } = useGardenStore.getState();

            setFilteredGardens(gardens);

            const typeSet = new Set();

            gardens.forEach((garden) => {
                if (garden.gardenTypes) {
                    Object.keys(garden.gardenTypes).forEach((key) => {
                        typeSet.add(key);
                    });
                }
            });

            const uniqueTypes = Array.from(typeSet);
            console.log('All Garden Type Keys:', uniqueTypes);
            setGardenTypeOptions(uniqueTypes);
        };

        loadGardens();
    }, []);

    const handleFilterApply = () => {
        const { gardens } = useGardenStore.getState();

        if (selectedTypes.length === 0) {
            setFilteredGardens(gardens); // No filter applied
            return;
        }

        const filtered = gardens.filter((garden) => {
            if (!garden.gardenTypes) return false;

            // Check if all selected types are marked as "Y"
            return selectedTypes.every((type) => garden.gardenTypes[type] === 'Y');
        });

        setFilteredGardens(filtered);
    };

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
                        options={filteredGardens}
                        getOptionLabel={(option) =>
                            option.name
                                ? `${option.name} (${option.address})`
                                : `Garden #${option.mapNumber} (${option.address})`
                        }
                        filterOptions={(options, state) =>
                            options.filter((garden) => {
                                const text = state.inputValue.toLowerCase();
                                return (
                                    garden.name?.toLowerCase().includes(text) ||
                                    garden.address?.toLowerCase().includes(text)
                                );
                            })
                        }
                        onChange={(event, value) => {
                            if (value) {
                                setSelectedGardenId(value.mapNumber);
                            } else {
                                setSelectedGardenId(null);
                            }
                        }}
                        renderOption={(props, option) => (
                            <Box component="li" {...props} sx={{ display: 'flex', flexDirection: 'column', }}>
                                <Typography variant="body2" fontWeight={600}>
                                    {option.name || `Garden #${option.mapNumber}`}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {option.address}
                                </Typography>
                            </Box>
                        )}
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
                            {gardenTypeOptions.map((name) => (
                                <MenuItem key={name} value={name} >
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <IconButton color="primary" onClick={handleFilterApply}>
                        <TuneIcon />
                    </IconButton>
                </Box>
            </Box>

            <div className='s-p-garden-list'>
                {/* Garden List */}
                <List sx={{ bgcolor: 'background.paper', p: 0 }}>
                    {filteredGardens
                        .slice()
                        .sort((a, b) => a.mapNumber - b.mapNumber) // ✅ Sort by mapNumber
                        .map((garden, index) => (
                            <React.Fragment key={garden.id || index}>
                                <ListItemButton alignItems="flex-start"
                                    ref={(el) => (gardenRefs.current[garden.mapNumber] = el)}
                                    sx={{
                                        borderRadius: 1,
                                        bgcolor: selectedGardenId === garden.mapNumber ? 'primary.light' : 'transparent',
                                        '&:hover': {
                                            bgcolor: selectedGardenId === garden.mapNumber ? 'primary.light' : 'action.hover',
                                        },
                                    }}
                                    onClick={() =>
                                        setSelectedGardenId(
                                            selectedGardenId === garden.mapNumber ? null : garden.mapNumber
                                        )
                                    }>
                                    <ListItemAvatar>
                                        <Avatar>
                                            {garden.mapNumber}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={garden.name || `Garden #${garden.mapNumber}`}
                                        secondary={
                                            <Typography component="span" variant="body2" fontSize={12} color="text.primary">
                                                {garden.address}
                                            </Typography>
                                        }
                                    />
                                </ListItemButton>
                                {index !== gardens.length - 1 && <Divider variant="inset" component="li" />}
                            </React.Fragment>
                        ))}
                </List>
            </div>
        </div>
    );
};

export default SidePanel;
