import React from 'react';
import { useEffect, useState } from 'react';

import {
    Typography, Autocomplete, TextField, Box, Chip, List,
    ListItemText, ListItemAvatar, Avatar, ListItemButton, Divider, Tooltip,
    IconButton
} from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import useGardenStore from '../store/gardenStore';
import gardenTypeIcons from '../utils/gardenTypeIcons';
import MapKey from './mapKey';

const SidePanel = ({ selectedGarden, setSelectedGarden, resetSignal }) => {
    const [selectedTypes, setSelectedTypes] = React.useState([]);
    const [selectedGardenId, setSelectedGardenId] = React.useState(null);
    const gardenRefs = React.useRef({});

    const { gardens, fetchGardens } = useGardenStore();
    const [gardenTypeOptions, setGardenTypeOptions] = React.useState([]);
    const [filteredGardens, setFilteredGardens] = React.useState([]);

    const [panelVisible, setPanelVisible] = useState(true);

    const [searchValue, setSearchValue] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [loading, setLoading] = React.useState(true);

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
            setLoading(true);
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
            setLoading(false);
        };

        loadGardens();
    }, []);

    useEffect(() => {
        // Reset internal state when resetSignal changes
        setSelectedTypes([]);
        setSelectedGardenId(null);
        setPanelVisible(true); // Optional: reopen panel on reset
        setSearchValue(null);

        // Optionally re-load or show all gardens
        const { gardens } = useGardenStore.getState();
        setFilteredGardens(gardens);

    }, [resetSignal]);

    return (
        <div className='side-panel-overlay'>
            <div
                className="side-panel-toggle-btn-container"
                style={{
                    top: panelVisible
                        ? isMobile
                            ? 'calc(50% - 25px)' // panel visible + mobile
                            : '20px'             // panel visible + desktop
                        : isMobile
                            ? 'calc(100% - 45px)' // panel hidden + mobile
                            : '20px',             // panel hidden + desktop
                }}
            >

                <IconButton
                    onClick={() => setPanelVisible(!panelVisible)}
                    className="side-panel-toggle-btn"
                    sx={{
                        bgcolor: "#cecece",
                        color: 'white',
                        '&:hover': {
                            bgcolor: 'primary.dark',
                        },
                        // bottom: isMobile ? '0' : '0',

                    }}
                >
                    {isMobile
                        ? panelVisible ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />
                        : panelVisible ? <ChevronLeftIcon /> : <ChevronRightIcon />
                    }
                </IconButton>
            </div>

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

            {panelVisible && (
                <Box display="flex" className="side-panel-container" >
                    <div className='side-panel-content'>
                        <Box sx={{ pl: 2, pr: 2 }}>
                            {/* Title */}
                            <Box sx={{ mb: 2 }}>
                                <Typography color='#333a57' variant="h5" fontWeight={600}
                                    className='s-p-header'
                                >
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
                                        `#${option.mapNumber}: ${option.name || 'Garden'}`
                                    }
                                    filterOptions={(options, state) =>
                                        options.filter((garden) => {
                                            const text = state.inputValue.toLowerCase();
                                            return (
                                                garden.name?.toLowerCase().includes(text) ||
                                                garden.address?.toLowerCase().includes(text) ||
                                                garden.description?.toString().toLowerCase().includes(text)
                                            );
                                        })
                                    }
                                    value={searchValue}
                                    onChange={(event, value) => {
                                        setSearchValue(value);
                                        if (value) {
                                            setSelectedGardenId(value.mapNumber);
                                            setSelectedGarden(value);
                                        } else {
                                            setSelectedGardenId(null);
                                            setSelectedGarden(null);
                                        }
                                    }}
                                    renderOption={(props, option) => {
                                        const { key, ...rest } = props;  // extract key from props

                                        return (
                                            <li key={key} {...rest} style={{ textAlign: 'left' }}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'flex-start',
                                                        width: '100%',
                                                    }}
                                                >
                                                    <Typography variant="body2" fontWeight={600}>
                                                        #{option.mapNumber}: {option.name || 'Garden'}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {option.address}
                                                    </Typography>
                                                </Box>
                                            </li>
                                        );
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Search Gardens" />}
                                />
                            </Box>
                        </Box>

                        <div className='s-p-garden-list'>
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                    <CircularProgress />
                                </Box>
                            ) : filteredGardens.length === 0 ? (
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
                                                {isMobile ? (
                                                    // 👉 No Tooltip on mobile
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
                                                            <ListItemAvatar>
                                                                <Avatar
                                                                    sx={{
                                                                        bgcolor: selectedGardenId === garden.mapNumber
                                                                            ? 'primary.dark'
                                                                            : garden.group === 'Residential'
                                                                                ? '#00a025'
                                                                                : garden.group === 'Community'
                                                                                    ? '#119cff'
                                                                                    : garden.group === 'Welcome Center'
                                                                                        ? '#ffd415'
                                                                                        : 'grey.300', // fallback color

                                                                        color: selectedGardenId === garden.mapNumber ? 'white' : 'black',
                                                                        '&:hover': {
                                                                            bgcolor: selectedGardenId === garden.mapNumber
                                                                                ? 'primary.dark'
                                                                                : garden.group === 'Residential'
                                                                                    ? '#00911f'
                                                                                    : garden.group === 'Community'
                                                                                        ? '#0d88e0'
                                                                                        : garden.group === 'Welcome Center'
                                                                                            ? '#e6c200'
                                                                                            : 'white',
                                                                        },
                                                                    }}
                                                                >
                                                                    {garden.mapNumber}
                                                                </Avatar>
                                                            </ListItemAvatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={
                                                                (garden.address?.length > 30)
                                                                    ? `${garden.address.slice(0, 30)}...`
                                                                    : garden.address || `Garden #${garden.mapNumber}`
                                                            }
                                                            secondary={
                                                                <Box
                                                                    component="span" // prevent nesting <div> inside <p>
                                                                    sx={{
                                                                        display: 'flex',
                                                                        gap: 1,
                                                                        color: selectedGardenId === garden.mapNumber ? 'white' : '#969696',
                                                                        justifyContent: 'flex-end',
                                                                    }}
                                                                >
                                                                    {Object.keys(garden.gardenTypes || {})
                                                                        .filter((key) => garden.gardenTypes[key] === 'Y')
                                                                        .map((key) => (
                                                                            <Box component="span" key={key} title={key}>
                                                                                {gardenTypeIcons[key] || null}
                                                                            </Box>
                                                                        ))}
                                                                </Box>
                                                            }
                                                        />
                                                    </ListItemButton>
                                                ) : (
                                                    <Tooltip
                                                        title={
                                                            <React.Fragment>
                                                                <Typography variant="subtitle1" fontWeight={600}>
                                                                    {garden.name || `Garden #${garden.mapNumber}`}
                                                                </Typography>
                                                                <Typography variant="body2" fontStyle={"italic"}>
                                                                    {garden.description || 'No description'}
                                                                </Typography>
                                                            </React.Fragment>
                                                        }
                                                        arrow
                                                        placement="right"
                                                        enterDelay={600}
                                                        leaveDelay={0}
                                                    >
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
                                                                        bgcolor: selectedGardenId === garden.mapNumber
                                                                            ? garden.group === 'Residential'
                                                                                ? 'white'
                                                                                : garden.group === 'Community'
                                                                                    ? 'white'
                                                                                    : garden.group === 'Welcome Center'
                                                                                        ? 'white'
                                                                                        : 'white'
                                                                            : garden.group === 'Residential'
                                                                                ? '#00a025'
                                                                                : garden.group === 'Community'
                                                                                    ? '#119cff'
                                                                                    : garden.group === 'Welcome Center'
                                                                                        ? '#ffd415'
                                                                                        : 'grey.300',

                                                                        color: selectedGardenId === garden.mapNumber
                                                                            ? garden.group === 'Residential'
                                                                                ? '#00a025'
                                                                                : garden.group === 'Community'
                                                                                    ? '#119cff'
                                                                                    : garden.group === 'Welcome Center'
                                                                                        ? '#e4a300'
                                                                                        : 'black'
                                                                            : 'black',

                                                                        '&:hover': {
                                                                            bgcolor: selectedGardenId === garden.mapNumber
                                                                                ? garden.group === 'Residential'
                                                                                    ? '#f4f4f4'
                                                                                    : garden.group === 'Community'
                                                                                        ? '#f0f0f0'
                                                                                        : garden.group === 'Welcome Center'
                                                                                            ? '#222'
                                                                                            : '#eee'
                                                                                : garden.group === 'Residential'
                                                                                    ? '#00911f'
                                                                                    : garden.group === 'Community'
                                                                                        ? '#0d88e0'
                                                                                        : garden.group === 'Welcome Center'
                                                                                            ? '#e6c200'
                                                                                            : 'white',
                                                                        },
                                                                    }}
                                                                >
                                                                    {garden.mapNumber}
                                                                </Avatar>
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primary={
                                                                    (garden.address?.length > 20)
                                                                        ? `${garden.address.slice(0, 20)}...`
                                                                        : garden.address || `Garden #${garden.mapNumber}`
                                                                }
                                                                secondary={
                                                                    <Box
                                                                        component="span" // prevent nesting <div> inside <p>
                                                                        sx={{
                                                                            display: 'flex',
                                                                            gap: 1,
                                                                            color: selectedGardenId === garden.mapNumber ? 'white' : '#969696',
                                                                            justifyContent: 'flex-end',
                                                                        }}
                                                                    >
                                                                        {Object.keys(garden.gardenTypes || {})
                                                                            .filter((key) => garden.gardenTypes[key] === 'Y')
                                                                            .map((key) => (
                                                                                <Box component="span" key={key} title={key}>
                                                                                    {gardenTypeIcons[key] || null}
                                                                                </Box>
                                                                            ))}
                                                                    </Box>
                                                                }
                                                            />
                                                        </ListItemButton>
                                                    </Tooltip>
                                                )}
                                                {index !== gardens.length - 1 && <Divider variant="inset" component="li" />}
                                            </React.Fragment>
                                        ))}
                                </List>
                            )}
                        </div>
                    </div>
                </Box>
            )}

            <div
                className="map-key-wrapper"
                style={{
                    left: isMobile
                        ? 'calc(100% - 230px)'                      // Mobile: always 20px
                        : panelVisible
                            ? '330px'                  // Desktop + panel open
                            : '10px',                  // Desktop + panel closed
                }}
            >
                <MapKey />
            </div>
        </div>
    );
};

export default SidePanel;
