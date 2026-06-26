import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const MyRoutePopup = ({ open, onClose, gardens }) => {
  const [routeIds, setRouteIds] = useState([]);

  useEffect(() => {
    if (!open) return;

    const ids = JSON.parse(localStorage.getItem("myRoute") || "[]");
    setRouteIds(ids);
  }, [open]);

  const openGoogleMaps = () => {
    const selectedGardens = routeIds
      .map((id) => gardens.find((g) => g.mapNumber === id))
      .filter(Boolean);

    if (selectedGardens.length < 2) {
      alert("Please select at least two gardens.");
      return;
    }

    const origin = `${selectedGardens[0].location._lat},${selectedGardens[0].location._long}`;

    const destination = `${selectedGardens[selectedGardens.length - 1].location._lat},${selectedGardens[selectedGardens.length - 1].location._long}`;

    const waypoints = selectedGardens
      .slice(1, -1)
      .map((g) => `${g.location._lat},${g.location._long}`)
      .join("|");

    let url =
      `https://www.google.com/maps/dir/?api=1` +
      `&origin=${origin}` +
      `&destination=${destination}`;

    if (waypoints.length > 0) {
      url += `&waypoints=${encodeURIComponent(waypoints)}`;
    }

    window.open(url, "_blank");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        My Route
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {routeIds.length === 0 ? (
          <Typography>No gardens have been added yet.</Typography>
        ) : (
          <List>
            {routeIds.map((id, index) => (
              <ListItem key={id}>
                <ListItemText
                  primary={`Stop ${index + 1}`}
                  secondary={`Garden #${id}`}
                />
              </ListItem>
            ))}
          </List>
        )}

        <Box mt={2} display="flex" gap={2}>
          <Button
            color="error"
            variant="outlined"
            onClick={() => {
              localStorage.removeItem("myRoute");
              setRouteIds([]);
            }}
          >
            Clear List
          </Button>

          <Button
            variant="contained"
            disabled={routeIds.length < 2}
            variant="contained"
            disabled={routeIds.length < 2}
            onClick={openGoogleMaps}
          >
            View on Google Maps
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default MyRoutePopup;
