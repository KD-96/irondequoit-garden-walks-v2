import { useState, useRef } from 'react';

import { Button, IconButton } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import MapComponent from '../components/MapComponent'
import SidePanel from '../components/SidePanel'
import InfoCard from '../components/InfoCard'

import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [selectedGarden, setSelectedGarden] = useState(null);

    const navigate = useNavigate();

    // Optionally track a reset counter
    const [resetSignal, setResetSignal] = useState(0);

    const handleReset = () => {
        setSelectedGarden(null);
        setResetSignal(prev => prev + 1); // To notify child components
    };

    const handleNav = () => {
        navigate('/admin')
    }
    // https://irondequoit-garden-walks-v2.vercel.app/admin
    return (
        <div className="home-page-container">
            <div className="map-container">

                <Button onClick={handleNav}
                    sx={{
                        scale: 0.8,
                        position: 'absolute',
                        top: 180,
                        right: 5,
                        zIndex: 10,
                        bgcolor: 'white',
                    }}
                >
                    Upload CSV
                </Button>

                <IconButton
                    aria-label='keoo'
                    title='Reset all changes'
                    onClick={handleReset}
                    sx={{
                        scale: 0.8,
                        position: 'absolute',
                        top: 140,
                        right: 5,
                        zIndex: 10,
                        bgcolor: 'white',
                        boxShadow: 1,
                        transition: 'background-color 0.2s ease',
                        '&:hover': {
                            bgcolor: '#ebebeb',
                        },
                    }}
                >
                    <RestartAltIcon />
                </IconButton>

                <MapComponent
                    selectedGarden={selectedGarden}
                    setSelectedGarden={setSelectedGarden}
                // resetSignal={resetSignal} 
                />

                <div >
                    <SidePanel
                        selectedGarden={selectedGarden}
                        setSelectedGarden={setSelectedGarden}
                        resetSignal={resetSignal}
                    />
                    {/* <MapKey /> */}
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