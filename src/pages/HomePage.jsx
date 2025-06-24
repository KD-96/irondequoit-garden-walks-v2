import { useState } from 'react';

import MapComponent from '../components/MapComponent'
import SidePanel from '../components/SidePanel'
import InfoCard from '../components/InfoCard'

const HomePage = () => {
    const [selectedGarden, setSelectedGarden] = useState(null);

    return (
        <div className="home-page-container">
            <div className="map-container">
                <MapComponent
                    selectedGarden={selectedGarden}
                    setSelectedGarden={setSelectedGarden}
                />
                <div className="side-panel-container">
                    <SidePanel
                        selectedGarden={selectedGarden}
                        setSelectedGarden={setSelectedGarden}
                    />
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