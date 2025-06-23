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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';

const InfoCard = ({ garden, onClose }) => {
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
                            sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
                        >
                            <CloseIcon />
                        </IconButton>

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
                            <Typography variant="body2" color="text.secondary">
                                {garden.description}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={onClose}>Close</Button>
                        </CardActions>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default InfoCard;
