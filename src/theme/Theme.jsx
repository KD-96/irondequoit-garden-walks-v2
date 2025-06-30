// src/theme/customTheme.js
import { createTheme } from '@mui/material/styles';

const customTheme = createTheme({
    palette: {
        mode: 'light', // or 'dark

        primary: {
            main: '#a9c094', // dark green for garden theme
            dark: '#6e9a45'
        },
        secondary: {
            main: '#66bb6a', // lighter green
        },



        background: {
            default: '#f4f8f5',
            paper: '#ffffff',
        },
        text: {
            primary: '#333333',
            secondary: '#5f5f5f',
        },
    },
    typography: {
        fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
        // h6: {
        //     fontWeight: 600,
        // },
        // body2: {
        //     fontSize: '0.9rem',
        // },
    },
    shape: {
        borderRadius: 10,
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
    },
});

export default customTheme;
