// src/utils/gardenTypeIcons.js

import React from 'react';
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';

import GrassIcon from '@mui/icons-material/Grass';
import WaterIcon from '@mui/icons-material/Water';
import EmojiNatureIcon from '@mui/icons-material/EmojiNature';
import PaletteIcon from '@mui/icons-material/Palette';
import AccessibleIcon from '@mui/icons-material/Accessible';

const gardenTypeIcons = {
    'Vegetable/ Fruit': <GrassIcon fontSize="small" />,
    'Water Feature': <WaterIcon fontSize="small" />,
    'Wheelchair/ Stroller': <AccessibleIcon fontSize="small" />,
    'Pollinator/ Native': <EmojiNatureIcon fontSize="small" />,
    'Art/ Sculpture': <PaletteIcon fontSize="small" />,
    default: <CenterFocusWeakIcon fontSize="small" />
};

export default gardenTypeIcons;
