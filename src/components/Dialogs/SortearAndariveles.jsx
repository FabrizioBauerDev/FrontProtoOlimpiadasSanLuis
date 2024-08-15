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
import { multipleUpdateParticipa } from "@/Api/api";

function crearRango(n, m) {
  // Genera el rango desde n hasta m
  return Array.from({ length: m - n + 1 }, (_, i) => n + i);
}

const mezclar = (array) => { 
  return array.sort(() => Math.random() - 0.5); 
}; 


export default function SortearAndariveles({
  open,
  handleClose,
  cantAtletas,
  participaciones,
  setParticipaciones
}) {
  const [minAndarivel, setMinAndarivel] = useState(1);
  const [maxAndarivel, setMaxAndarivel] = useState(1);

  const handleSortear = async () => {
    // Lógica para sortear andariveles
    if(minAndarivel > maxAndarivel) {
      alert("El andarivel mínimo no puede ser mayor al máximo");
      return;
    }
    else if((maxAndarivel - minAndarivel) + 1 != cantAtletas) {
      alert("La cantidad de andariveles no coincide con la cantidad de atletas");
      return;
    }
    // Sorteo
    let andariveles = mezclar(crearRango(minAndarivel, maxAndarivel));
    andariveles= mezclar(andariveles);
    // Lógica para actualizar los andariveles en la base de datos
    participaciones.forEach((participacion, index) => {
      participacion.andarivel = andariveles[index];
    });
    const res = await multipleUpdateParticipa(participaciones[0].id.serieId , participaciones);
    setParticipaciones(res.data);
    handleClose();
  };

  useEffect(() => {
    setMinAndarivel(1);
    setMaxAndarivel(cantAtletas);
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Sortear andariveles</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Ingrese entre qué rango de andariveles desea sortear (hay{" "}
          {cantAtletas} atletas en la serie):
        </DialogContentText>
        <Grid container spacing={2} mt={2}>
          <Grid item xs={6}>
            <TextField
              label="Mínimo"
              type="number"
              inputProps={{ min: "1" }}
              value={minAndarivel}
              onChange={(e) => setMinAndarivel(Number(e.target.value))}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Máximo"
              type="number"
              value={maxAndarivel}
              onChange={(e) => setMaxAndarivel(Number(e.target.value))}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSortear} color="success" variant="contained">
          Sortear
        </Button>
      </DialogActions>
    </Dialog>
  );
}
