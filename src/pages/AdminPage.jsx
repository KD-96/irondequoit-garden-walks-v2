import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import Papa from 'papaparse';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase.config'; // Only import db now
import { GeoPoint } from 'firebase/firestore';

const AdminPage = () => {
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async function (results) {
                const gardens = results.data;

                if (!gardens || gardens.length === 0) {
                    alert('No data found in CSV.');
                    return;
                }

                console.log('Parsed CSV data:', gardens); // 👈 helpful for debugging

                const batch = writeBatch(db);
                const gardenCollection = collection(db, 'gardens');

                try {
                    gardens.forEach((garden, index) => {
                        // Validate that mapNumber exists and is a number
                        const mapNumber = Number(garden.mapNumber);
                        if (!mapNumber || isNaN(mapNumber)) {
                            console.warn(`Skipping row ${index + 1}: invalid mapNumber`, garden);
                            return;
                        }

                        const docRef = doc(gardenCollection, mapNumber.toString());

                        const parsedGarden = {
                            mapNumber: mapNumber,
                            address: garden.address || '',
                            zipcode: Number(garden.zipcode) || null,
                            name: garden.name || '',
                            location: new GeoPoint(Number(garden.latitude), Number(garden.longitude)),
                            description: garden.description || '',
                            gardenTypes: {
                                waterFeature: garden.waterFeature || '',
                                art_sculpture: garden.art_sculpture || '',
                                pollinator_native: garden.pollinator_native || '',
                                vegetable_fruit: garden.vegetable_fruit || '',
                                wheelchair_stroller: garden.wheelchair_stroller || '',
                            },
                            icon: garden.icon || '',
                            group: garden.group || '',
                        };

                        batch.set(docRef, parsedGarden);
                    });

                    await batch.commit();
                    alert('Gardens uploaded successfully!');
                } catch (error) {
                    console.error('Upload error:', error);
                    alert('Failed to upload gardens. Check console for details.');
                }
            },
            error: function (err) {
                console.error('PapaParse error:', err);
                alert('CSV parsing failed. Please check the file format.');
            },
        });
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Admin Panel
            </Typography>
            <Button variant="contained" component="label">
                Upload Garden CSV
                <input type="file" accept=".csv" hidden onChange={handleFileUpload} />
            </Button>
        </Box>
    );
};

export default AdminPage;
