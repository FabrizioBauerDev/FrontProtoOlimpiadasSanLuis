import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Grid,
  Button,
} from "@mui/material";
import { fetchgenerateFinals } from "@/Api/api";

export default function SortearAndariveles({ open, handleClose, prueba }) {
  const [cantFinales, setCantFinales] = useState(1);

  const handleCrearFinales = async () => {
    try {
      const response = await fetchgenerateFinals(prueba.id, cantFinales);
      handleClose();
    } catch (error) {
      console.error("Error al generar finales:", error);
    }
  };

  useEffect(() => {
    setCantFinales(1);
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Crear Finales</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Ingrese la cantidad de finales que desea crear.
        </DialogContentText>
        <Grid container spacing={2} mt={2}>
          <Grid item xs={3}></Grid>
          <Grid item xs={6}>
            <TextField
              label="Cantidad de finales"
              type="number"
              inputProps={{ min: "1" }}
              value={cantFinales}
              onChange={(e) => setCantFinales(Number(e.target.value))}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
        <Button
          onClick={handleCrearFinales}
          color="success"
          variant="contained"
        >
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
}
