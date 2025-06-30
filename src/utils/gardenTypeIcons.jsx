// src/utils/gardenTypeIcons.js

import React from 'react';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import NatureIcon from '@mui/icons-material/Nature';
import AccessibleIcon from '@mui/icons-material/Accessible';
import ParkIcon from '@mui/icons-material/Park';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';

const gardenTypeIcons = {
    vegetable_fruit: <LocalFloristIcon fontSize="small" />,
    waterFeature: <NatureIcon fontSize="small" />,
    wheelchair_stroller: <AccessibleIcon fontSize="small" />,
    pollinator_native: <ParkIcon fontSize="small" />,
    art_sculpture: <AgricultureIcon fontSize="small" />,
    default: <CenterFocusWeakIcon fontSize="small" />
};

export default gardenTypeIcons;
