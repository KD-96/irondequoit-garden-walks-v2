import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Papa from 'papaparse';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase.config'; // Only import db now
import { GeoPoint } from 'firebase/firestore';

import { storage } from '../firebase/firebase.config';
import { ref, uploadString } from 'firebase/storage';
import { getDocs, deleteDoc } from 'firebase/firestore';

const AdminPage = () => {
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const [uploading, setUploading] = React.useState(false);

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

                const batch = writeBatch(db);
                const gardenCollection = collection(db, 'gardens');
                setUploading(true);

                try {
                    for (const [index, garden] of gardens.entries()) {
                        const mapNumber = Number(garden.mapNumber);
                        if (!mapNumber || isNaN(mapNumber)) {
                            console.warn(`Skipping row ${index + 1}: invalid mapNumber`, garden);
                            continue;
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
                                'Water Feature': garden['Water Feature'] || '',
                                'Art / Sculpture': garden['Art / Sculpture'] || '',
                                'Pollinator / Native': garden['Pollinator / Native'] || '',
                                'Vegetable / Fruit': garden['Vegetable / Fruit'] || '',
                                'Wheelchair / Stroller': garden['Wheelchair / Stroller'] || '',
                            },
                            icon: garden.icon || '',
                            group: garden.group || '',
                        };

                        // ✅ Create folder by uploading a dummy file
                        try {
                            const folderRef = ref(storage, `gardens/${mapNumber}/placeholder.txt`);
                            await uploadString(folderRef, 'Reserved for garden images.');
                        } catch (err) {
                            console.warn(`Failed to create folder for mapNumber ${mapNumber}`, err);
                        }

                        batch.set(docRef, parsedGarden);
                    }

                    await batch.commit();
                    alert('Gardens uploaded successfully!');
                } catch (error) {
                    console.error('Upload error:', error);
                    alert('Failed to upload gardens. Check console for details.');
                } finally {
                    setUploading(false); // ⬅️ Stop loading
                }
            },
            error: function (err) {
                console.error('PapaParse error:', err);
                alert('CSV parsing failed. Please check the file format.');
            },
        });
    };

    const handleDeleteGardens = async () => {
        setDeleting(true);
        try {
            const snapshot = await getDocs(collection(db, 'gardens'));
            const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
            await Promise.all(deletePromises);
            alert('All gardens deleted successfully!');
        } catch (error) {
            console.error('Error deleting gardens:', error);
            alert('Failed to delete gardens.');
        }
        setDeleting(false);
        setConfirmOpen(false);
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

            <Button
                variant="contained"
                color="error"
                sx={{ marginLeft: 3 }}
                onClick={() => setConfirmOpen(true)}

            >
                Delete All Gardens
            </Button>

            <Dialog open={uploading}>
                <DialogTitle>Uploading Gardens</DialogTitle>
                <DialogContent>
                    <DialogContentText>Please wait while your CSV data is being uploaded...</DialogContentText>
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Typography mr={2}>Uploading</Typography>
                        <div className="spinner">
                            <svg width="24" height="24" viewBox="0 0 50 50">
                                <circle
                                    cx="25"
                                    cy="25"
                                    r="20"
                                    fill="none"
                                    strokeWidth="5"
                                    stroke="#1976d2"
                                    strokeLinecap="round"
                                    strokeDasharray="31.4 31.4"
                                    transform="rotate(-90 25 25)"
                                >
                                    <animateTransform
                                        attributeName="transform"
                                        type="rotate"
                                        values="0 25 25;360 25 25"
                                        dur="1s"
                                        repeatCount="indefinite"
                                    />
                                </circle>
                            </svg>
                        </div>
                    </Box>
                </DialogContent>
            </Dialog>

            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete <strong>all garden data</strong>? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)} disabled={deleting}>
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteGardens} color="error" disabled={deleting}>
                        {deleting ? 'Deleting...' : 'Confirm'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminPage;
