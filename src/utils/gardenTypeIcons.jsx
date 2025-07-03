// src/utils/gardenTypeIcons.js

import React from 'react';
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';

import GrassIcon from '@mui/icons-material/Grass';
import WaterIcon from '@mui/icons-material/Water';
import EmojiNatureIcon from '@mui/icons-material/EmojiNature';
import PaletteIcon from '@mui/icons-material/Palette';
import AccessibleIcon from '@mui/icons-material/Accessible';

const gardenTypeIcons = {
    vegetable_fruit: <GrassIcon fontSize="small" />,
    waterFeature: <WaterIcon fontSize="small" />,
    wheelchair_stroller: <AccessibleIcon fontSize="small" />,
    pollinator_native: <EmojiNatureIcon fontSize="small" />,
    art_sculpture: <PaletteIcon fontSize="small" />,
    default: <CenterFocusWeakIcon fontSize="small" />
};

export default gardenTypeIcons;
