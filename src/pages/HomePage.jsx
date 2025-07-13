import { useState, useRef } from 'react';

import { Button, IconButton } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import MapComponent from '../components/MapComponent'
import SidePanel from '../components/SidePanel'
import InfoCard from '../components/InfoCard'

const HomePage = () => {
    const [selectedGarden, setSelectedGarden] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Optionally track a reset counter
    const [resetSignal, setResetSignal] = useState(0);

    const [isPanelOpen, setIsPanelOpen] = useState(true)

    const handleReset = () => {
        setSelectedGarden(null);
        setResetSignal(prev => prev + 1); // To notify child components
    };

    return (
        <div className="home-page-container">
            <div className="map-container">

                <Button
                    variant="contained"
                    startIcon={<RestartAltIcon />}
                    onClick={handleReset}
                    title='Reset all changes'
                    sx={{
                        width: '100px',
                        position: 'absolute',
                        top: 150,
                        right: 5,
                        zIndex: 10,
                        bgcolor: 'white',
                        color: '#ff8585',
                        boxShadow: 1,
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        '&:hover': {
                            bgcolor: '#ebebeb',
                        },
                    }}
                >
                    Reset
                </Button>

                <MapComponent
                    selectedGarden={selectedGarden}
                    setSelectedGarden={setSelectedGarden}
                    resetSignal={resetSignal}
                    isPanelOpen={isPanelOpen}
                />

                <div >
                    {(!isMobile || !selectedGarden) && (
                        <SidePanel
                            selectedGarden={selectedGarden}
                            setSelectedGarden={setSelectedGarden}
                            resetSignal={resetSignal}
                            setIsPanelOpen={setIsPanelOpen}
                        />
                    )}
                </div>

                <div className="info-card-container">
                    <InfoCard
                        garden={selectedGarden}
                        onClose={() => setSelectedGarden(null)}
                    />
                </div>

            </div>
        </div>
    )
}

export default HomePage