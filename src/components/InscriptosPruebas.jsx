import {
  Container,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Autocomplete,
  Typography,
  Button,
  Grid
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { reemplazarGuionesBajos , formatearFecha } from "@/Utils/utils";
import React, { useState, useEffect } from "react";
import { fetchPruebasByEtapa } from "@/Api/api";

function InscriptosPruebas({ idEtapa }) {
    const [categoria, setCategoria] = useState('');
    const [sexo, setSexo] = useState('');
    const [selectedName, setSelectedName] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [sexos, setSexos] = useState([]);
    const [nombresOptions, setNombresOptions] = useState([]);
  
    const [json, setJson] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPruebasByEtapa(idEtapa);
      setJson(data);
      //funcion para filtrar categorias
      const uniqueCategorias = [...new Set(data.map((item) => item.categoria))];
      setCategorias(uniqueCategorias);
    };
    fetchData();
  }, []);

// Handle Categoria Change
const handleCategoriaChange = (event) => {
    const selectedCategoria = event.target.value;
    setCategoria(selectedCategoria);
    setSexo('');
    setSelectedName(null);

    // Filtrar sexos únicos basados en la categoría seleccionada
    const filteredSexos = [
        ...new Set(
            json
                .filter((item) => item.categoria === selectedCategoria)
                .map((item) => item.sexo)
        ),
    ];
    setSexos(filteredSexos);

    // Si solo hay un sexo disponible, seleccionarlo automáticamente
    if (filteredSexos.length === 1) {
        setSexo(filteredSexos[0]);
    } else {
        setSexo("");
    }
};

// Handle Sexo Change
const handleSexoChange = (event) => {
    const selectedSexo = event.target.value;
    setSexo(selectedSexo);
    setSelectedName(null);

    // Filtrar nombres basados en la categoría y el sexo seleccionados
    const filteredNombres = json.filter(item => item.categoria === categoria && item.sexo === selectedSexo).map(item => item.nombre);
    const uniqueNombres = [...new Set(filteredNombres)];
    setNombresOptions(uniqueNombres.map(name => ({ label: name })));
};

const handleAutocompleteChange = (event, newValue) => {
    setSelectedName(newValue);
};


return (
    <Box>
      {json && (
        <Box>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={2}>
              <FormControl fullWidth>
                <InputLabel id="selectCategoria">Categoría</InputLabel>
                <Select
                  labelId="selectCategoria"
                  id="selectCategoria"
                  value={categoria}
                  label="Categoría"
                  onChange={handleCategoriaChange}
                >
                  {categorias.map((categoria) => (
                    <MenuItem key={categoria} value={categoria}>
                      {categoria}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              {categoria && (
                <FormControl fullWidth>
                  <InputLabel id="selectSexo">Sexo</InputLabel>
                  <Select
                    labelId="selectSexo"
                    id="selectSexo"
                    value={sexo}
                    label="Sexo"
                    onChange={handleSexoChange}
                  >
                    {sexos.map((sexo) => (
                      <MenuItem key={sexo} value={sexo}>
                        {sexo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Grid>
            <Grid item xs={4}>
              {categoria && sexo && (
                <Autocomplete
                  id="autocomplete-nombres"
                  options={nombresOptions}
                  getOptionLabel={(option) => option.label}
                  value={selectedName}
                  onChange={handleAutocompleteChange}
                  renderInput={(params) => <TextField {...params} label="Nombre" variant="outlined" />}
                  fullWidth
                />
              )}
            </Grid>
            <Grid item xs={2}>
            {categoria && sexo && selectedName && (
            <Button variant="contained" size="large" endIcon={<SearchIcon />}>Buscar</Button>
            )}
            </Grid>
          </Grid>
          <Box
            sx={{
              mt: 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* DATAGRID CUSTOM PA*/}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default InscriptosPruebas;
