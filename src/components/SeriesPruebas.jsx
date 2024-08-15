import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TextField,
  Button,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { fetchgenerateSeries } from "@/Api/api";
import SeriesDG from "@/components/DataGrids/SeriesDG";

export default function App({ prueba, series, setSeries, cantInscriptos }) {
  const [select1, setSelect1] = useState(1);
  const [select2, setSelect2] = useState(null);
  const [serie, setSerie] = useState(0);

  useEffect(() => {
    setSerie(0);
  }, [prueba]);

  // Handle select1 Change
  const handleSelect1Change = (event) => {
    const selected = event.target.value;
    setSelect1(selected);
    selected == 1 ? setSelect2(null) : setSelect2(0);
  };

  // Handle select2 Change
  const handleSelect2Change = (event) => {
    const selected = event.target.value;
    setSelect2(selected);
  };

  // Handle serie Change
  const handleSerieChange = (event) => {
    const selected = event.target.value;
    setSerie(selected);
  };

  // GENERAR SERIES
  const handleGenerar = async () => {
    let res;
    switch (select1) {
      case 1:
        res = await fetchgenerateSeries("generateSeriesByAnd", prueba.id, 0);
        setSeries(res.data);
        break;
        case 2:
        case 3:
        // Cantidad de andariveles o atletas por usuario
        // controlar que no sea mayor a la cantidad de inscriptos
        if (0 > select2 || select2 > cantInscriptos) {
          alert(
            `La cantidad no puede ser negativa, ni mayor a la cantidad de inscriptos (${cantInscriptos})`
          );
          return;
        }
        else{
          res = await fetchgenerateSeries(
            "generateSeriesByCantAtletas",
            prueba.id,
            select2
          );
          setSeries(res.data);
        }
        break;
      case 4:
        // Cantidad de series
        if (0 > select2 || select2 > cantInscriptos) {
          alert(
            `La cantidad no puede ser negativa, ni mayor a la cantidad de inscriptos (${cantInscriptos})`
          );
          return;
        }
        else{
          res = await fetchgenerateSeries(
            "generateSeriesByCantSeries",
            prueba.id,
            select2
          );
          setSeries(res.data);
        }
        break;
    }
  };

  return (
    <Box>
      {series.length === 0 ? (
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="generarSeriesLabel">Generar Series</InputLabel>
              <Select
                labelId="generarSeriesLabel"
                id="genSeries"
                value={select1}
                label="Generar Series"
                onChange={handleSelect1Change}
              >
                <MenuItem value={1}>Cantidad de andariveles etapa</MenuItem>
                <MenuItem value={2}>Cantidad de andariveles usuario</MenuItem>
                <MenuItem value={3}>Número de Atletas</MenuItem>
                <MenuItem value={4}>Número de Series</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {select1 > 1 && (
            <Grid item xs={2}>
              <TextField
                fullWidth
                id="cantidad"
                label="Cantidad"
                type="number"
                value={select2}
                onChange={handleSelect2Change}
                inputProps={{ min: "0", max: cantInscriptos }}
              />
            </Grid>
          )}
          {(select1 === 1 || (select1 > 1 && select2 > 0)) && (
            <Grid item xs={4}>
              <Button
                fullWidth
                size="large"
                variant="contained"
                onClick={handleGenerar}
              >
                Generar Serie
              </Button>
            </Grid>
          )}
        </Grid>
      ) : (
        <Box>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel id="selectSerielabel">Serie</InputLabel>
                <Select
                  labelId="selectSerielabel"
                  id="selectSerie"
                  value={serie}
                  label="Serie"
                  onChange={handleSerieChange}
                >
                  <MenuItem key={0} value={0}>
                    Mostrar todas
                  </MenuItem>
                  {series.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <SeriesDG
            serie={series.find((s) => s.id === serie) || null}
            prueba={prueba}
            serieId={serie}
          />
        </Box>
      )}
    </Box>
  );
}
