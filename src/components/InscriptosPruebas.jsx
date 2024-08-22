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
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InscriptosDG from "@/components/DataGrids/InscriptosDG";
import SeriesPruebas from "@/components/SeriesPruebas";
import React, { useState, useEffect } from "react";
import {
  fetchPruebasByEtapa,
  fetchInscriptosByPruebaId,
  fetchSeriesByPruebaId,
} from "@/Api/api";
import InscribirAtleta from "@/components/Dialogs/InscribirAtleta";

function InscriptosPruebas({ idEtapa }) {
  const [categoria, setCategoria] = useState("");
  const [sexo, setSexo] = useState("");
  const [selectedName, setSelectedName] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [sexos, setSexos] = useState([]);
  const [nombresOptions, setNombresOptions] = useState([]);
  const [selectedPrueba, setSelectedPrueba] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  // LISTA DE PRUEBAS
  const [json, setJson] = useState(null);

  // LISTA DE INSCRIPTOS
  const [inscriptos, setInscriptos] = useState(null);

  // LISTA DE SERIES
  const [series, setSeries] = useState(null);

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
    setSexo("");
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
    const filteredNombres = json
      .filter(
        (item) => item.categoria === categoria && item.sexo === selectedSexo
      )
      .map((item) => item.nombre);
    const uniqueNombres = [...new Set(filteredNombres)];
    setNombresOptions(uniqueNombres.map((name) => ({ label: name })));
  };

  //Buscar
  const handleSearch = async () => {
    if (categoria && sexo && selectedName) {
      const selectedPrueba = json.find(
        (prueba) =>
          prueba.categoria === categoria &&
          prueba.sexo === sexo &&
          prueba.nombre === selectedName.label
      );
      setSelectedPrueba(selectedPrueba);
      // Obtener los inscriptos de esa prueba
      const inscriptosRes = await fetchInscriptosByPruebaId(selectedPrueba.id);
      setInscriptos(inscriptosRes);
      // Obtener las series de esa prueba
      const seriesRes = await fetchSeriesByPruebaId(selectedPrueba.id);
      setSeries(seriesRes);
    }
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
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Nombre prueba"
                      variant="outlined"
                    />
                  )}
                  fullWidth
                />
              )}
            </Grid>
            <Grid item xs={2}>
              {categoria && sexo && selectedName && (
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<SearchIcon />}
                  onClick={handleSearch}
                >
                  Buscar
                </Button>
              )}
            </Grid>
          </Grid>
          {inscriptos && (
            <Box my={2}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  INSCRIPTOS
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="h6" mb={2}>
                    {selectedPrueba.categoria} - {selectedPrueba.sexo} -{" "}
                    {selectedPrueba.nombre}
                  </Typography>
                  {/* ACA AGREGAR UN GRID Y UN BOTON QUE OCUPE XS=3 PARA LA CARGA DE UN ATLETA */}
                  <Grid container spacing={2}>
                    <Grid item xs={3} mb={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleDialogOpen}
                      >
                        Inscribir Atleta
                      </Button>
                      <InscribirAtleta
                        open={openDialog}
                        onClose={handleDialogClose}
                        inscriptos={inscriptos}
                      />
                    </Grid>
                  </Grid>
                  <InscriptosDG inscriptos={inscriptos} />
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
          {series && (
            <Box my={2}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2-content"
                  id="panel2-header"
                >
                  SERIES
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="h6" mb={2}>
                    {selectedPrueba.categoria} - {selectedPrueba.sexo} -{" "}
                    {selectedPrueba.nombre}
                  </Typography>

                  <SeriesPruebas
                    prueba={selectedPrueba}
                    series={series}
                    setSeries={setSeries}
                    cantInscriptos={inscriptos.length}
                  />
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

export default InscriptosPruebas;
