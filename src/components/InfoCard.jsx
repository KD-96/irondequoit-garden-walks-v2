import React from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    CardActions,
    Button,
    IconButton,
    Box,
    Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';

const InfoCard = ({ garden, onClose }) => {
    if (!garden) return null;

    const activeTypes = garden.gardenTypes
        ? Object.entries(garden.gardenTypes)
            .filter(([_, value]) => value === 'Y')
            .map(([key]) => key.replace(/_/g, ' '))
        : [];

    // Dynamically set image path based on mapNumber
    const imagePath = `/imgs/g${garden.mapNumber}.jpg`;

    return (
        <AnimatePresence>
            {garden && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
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
                                bgcolor: 'rgba(255, 255, 255, 0.6)', // low opacity white
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.9)', // higher opacity on hover
                                },
                            }}
                        >
                            <CloseIcon />
                        </IconButton>

                        {/* Top Image */}
                        <CardMedia
                            component="img"
                            height="160"
                            image={imagePath}
                            alt={`Image of Garden #${garden.mapNumber}`}
                        />

                        {garden.image && (
                            <CardMedia
                                component="img"
                                height="160"
                                image={garden.image}
                                alt={`Image of ${garden.title}`}
                            />
                        )}

                        <CardContent>
                            <Typography variant="h6">{garden.name}</Typography>
                            <Typography variant="body1">{garden.address}</Typography>
                            <Typography variant="body2" color="text.secondary" fontStyle={'italic'}>
                                {garden.description}
                            </Typography>

                            {/* Garden Types */}
                            {activeTypes.length > 0 && (
                                <Box mt={2} sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {activeTypes.map((type) => (
                                        <Chip key={type} label={type} size="small" />
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
