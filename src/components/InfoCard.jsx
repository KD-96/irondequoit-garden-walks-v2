import React, { useEffect, useState } from 'react';
import {
    Card, CardMedia, CardContent, Typography,
    IconButton, Box, Chip, CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';

import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebase.config';

const InfoCard = ({ garden, onClose }) => {
    const [imageUrls, setImageUrls] = useState([]);
    const [loading, setLoading] = useState(true); // ⬅️ Add loading state

    useEffect(() => {
        if (!garden?.mapNumber) return;

        setLoading(true); // ⬅️ Start loading
        const folderRef = ref(storage, `gardens/${garden.mapNumber}`);

        listAll(folderRef)
            .then((res) => Promise.all(res.items.map((itemRef) => getDownloadURL(itemRef))))
            .then((urls) => {
                setImageUrls(urls);
                setLoading(false); // ⬅️ End loading
            })
            .catch((error) => {
                console.error('Error fetching Firebase images:', error);
                setImageUrls([]);
                setLoading(false); // ⬅️ Still end loading
            });
    }, [garden?.mapNumber]);

    if (!garden) return null;

    const activeTypes = garden.gardenTypes
        ? Object.entries(garden.gardenTypes)
            .filter(([_, value]) => value === 'Y')
            .map(([key]) => key.replace(/_/g, ' '))
        : [];

    return (
        <AnimatePresence>
            {garden && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="info-card-wrapper"
                >
                    <Card sx={{ width: 320, boxShadow: 3, position: 'relative' }}>
                        <IconButton
                            size="small"
                            onClick={onClose}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                zIndex: 1,
                                bgcolor: 'rgba(255, 255, 255, 0.6)',
                                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
                            }}
                        >
                            <CloseIcon />
                        </IconButton>

                        {/* ⬇️ Image loader container */}
                        <Box sx={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {loading ? (
                                <CircularProgress size={30} />
                            ) : (
                                imageUrls[0] && (
                                    <CardMedia
                                        component="img"
                                        height="160"
                                        image={imageUrls[0]}
                                        alt={`Garden ${garden.mapNumber}`}
                                    />
                                )
                            )}
                        </Box>

                        <CardContent>
                            <Typography variant="h6">{garden.name}</Typography>

                            <div>
                                {garden.group && (
                                    <Box
                                        component="span"
                                        sx={{
                                            display: 'inline-block',
                                            width: 10,
                                            height: 10,
                                            borderRadius: '50%',
                                            bgcolor:
                                                garden.group === 'residential'
                                                    ? '#00a025'
                                                    : garden.group === 'community'
                                                        ? '#119cff'
                                                        : garden.group === 'welcome_center'
                                                            ? '#ffd415'
                                                            : '#999',
                                        }}
                                    />
                                )}

                                <Typography component="span" variant="subtitle2" color="text.secondary">
                                    {garden.group ? ` ${garden.group}` : ''}
                                </Typography>
                            </div>

                            <Typography variant="body1">{garden.address}</Typography>
                            <Typography variant="body2" color="text.secondary" fontStyle={'italic'}>
                                {garden.description}
                            </Typography>

                            {activeTypes.length > 0 && (
                                <Box mt={2} sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {activeTypes.map((type) => (
                                        <Chip
                                            key={type}
                                            label={type}
                                            size="small"
                                            sx={{ bgcolor: '#333a57', color: 'white' }}
                                        />
                                    ))}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default InfoCard;
