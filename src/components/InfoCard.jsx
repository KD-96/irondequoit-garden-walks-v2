import React from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    CardActions,
    Button,
} from '@mui/material';

const InfoCard = ({ garden, onClose }) => {
    if (!garden) return null; // Only render if garden is selected

    return (
        <Card sx={{ width: 320, boxShadow: 3 }}>
            {garden.image && (
                <CardMedia
                    component="img"
                    height="160"
                    image={garden.image}
                    alt={`Image of ${garden.title}`}
                />
            )}
            <CardContent>
                <Typography variant="h6">
                    Garden #{garden.mapNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {garden.description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={onClose}>Close</Button>
            </CardActions>
        </Card>
    );
};

export default InfoCard;
