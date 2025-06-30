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

const SidePanel = ({ selectedGarden, setSelectedGarden }) => {
    const theme = useTheme();
    const [selectedTypes, setSelectedTypes] = React.useState([]);
    const [selectedGardenId, setSelectedGardenId] = React.useState(null);
    const gardenRefs = React.useRef({});

    const { gardens, fetchGardens } = useGardenStore();
    const [gardenTypeOptions, setGardenTypeOptions] = React.useState([]);
    const [filteredGardens, setFilteredGardens] = React.useState([]);

    useEffect(() => {
        const { gardens } = useGardenStore.getState();

        if (selectedTypes.length === 0) {
            setFilteredGardens(gardens); // Show all if none selected
        } else {
            const filtered = gardens.filter((garden) => {
                if (!garden.gardenTypes) return false;
                return selectedTypes.every((type) => garden.gardenTypes[type] === 'Y');
            });

            setFilteredGardens(filtered);
        }
    }, [selectedTypes]);

    useEffect(() => {
        if (selectedGarden === null) {
            setSelectedGardenId(null);
        } else {
            setSelectedGardenId(selectedGarden.mapNumber);
        }
    }, [selectedGarden]);

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
        <div className='side-panel-overlay'>
            {/* Filter Chips OUTSIDE the panel */}
            <Box className="s-p-filter-chips">
                {gardenTypeOptions.map((type) => {
                    const selected = selectedTypes.includes(type);
                    return (
                        <Chip
                            key={type}
                            label={type}
                            clickable
                            color={selected ? 'primary' : 'default'}
                            variant={selected ? 'filled' : 'outlined'}
                            onClick={() => {
                                setSelectedTypes((prev) =>
                                    selected ? prev.filter((t) => t !== type) : [...prev, type]
                                );
                            }}
                            sx={{
                                bgcolor: selected ? 'primary.main' : 'white',
                                color: selected ? 'white' : 'black',
                                borderColor: selected ? 'primary.main' : 'grey.300',
                                '&:hover': {
                                    bgcolor: selected ? 'primary.dark !important' : '#e3edda !important',
                                },
                            }}
                        />
                    );
                })}
            </Box>
            <Box display="flex" className="side-panel-container" >
                <div className='side-panel-content'>
                    <Box sx={{ pl: 2, pr: 2 }}>
                        {/* Title */}
                        <Box sx={{ mb: 2 }}>
                            <Typography color='#333a57' variant="h5" fontWeight={600}>
                                Garden List
                            </Typography>
                        </Box>

                        {/* Search Bar */}
                        <Box sx={{ mb: 2 }}>
                            <Autocomplete
                                sx={{ bgcolor: "white", borderRadius: 1 }}
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
                                        setSelectedGarden(value);
                                    } else {
                                        setSelectedGardenId(null);
                                        setSelectedGarden(null);
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
                    </Box>

                    <div className='s-p-garden-list'>
                        {filteredGardens.length === 0 ? (
                            <Box sx={{ p: 2 }}>
                                <Typography variant="body2" color="text.secondary" align="center">
                                    No gardens found.
                                </Typography>
                            </Box>
                        ) : (
                            <List sx={{ bgcolor: 'white', p: 0 }}>
                                {filteredGardens
                                    .slice()
                                    .sort((a, b) => a.mapNumber - b.mapNumber) // ✅ Sort by mapNumber
                                    .map((garden, index) => (
                                        <React.Fragment key={garden.id || index}>
                                            <ListItemButton alignItems="flex-start"
                                                ref={(el) => (gardenRefs.current[garden.mapNumber] = el)}
                                                sx={{
                                                    borderRadius: 2,
                                                    bgcolor: selectedGardenId === garden.mapNumber ? '#333a57' : 'white',
                                                    color: selectedGardenId === garden.mapNumber ? 'white' : 'black',
                                                    '&:hover': {
                                                        bgcolor: selectedGardenId === garden.mapNumber ? '#3d4564' : '#e3edda',
                                                    },
                                                }}
                                                onClick={() => {
                                                    setSelectedGardenId(
                                                        selectedGardenId === garden.mapNumber ? null : garden.mapNumber
                                                    )
                                                    if (selectedGarden?.mapNumber === garden.mapNumber) {
                                                        setSelectedGarden(null); // Deselect
                                                    } else {
                                                        setSelectedGarden(garden); // Select garden
                                                    }
                                                }
                                                    // setSelectedGardenId(
                                                    //     selectedGardenId === garden.mapNumber ? null : garden.mapNumber
                                                    // )
                                                }>
                                                <ListItemAvatar>
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: selectedGardenId === garden.mapNumber ? 'primary.dark' : 'grey.300',
                                                            color: selectedGardenId === garden.mapNumber ? 'white' : 'black',
                                                        }}
                                                    >
                                                        {garden.mapNumber}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={garden.name || `Garden #${garden.mapNumber}`}
                                                    secondary={
                                                        <Typography component="span" variant="body2" fontSize={12} color="text.primary"
                                                            sx={{
                                                                color: selectedGardenId === garden.mapNumber ? 'white' : 'black',
                                                            }}
                                                        >
                                                            {garden.address}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItemButton>
                                            {index !== gardens.length - 1 && <Divider variant="inset" component="li" />}
                                        </React.Fragment>
                                    ))}
                            </List>
                        )}
                    </div>
                </div>
            </Box>
        </div>
    );
};

export default SidePanel;
