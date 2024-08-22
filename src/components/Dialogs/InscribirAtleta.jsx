import { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Grid,
  Autocomplete,
  TextField,
  Paper,
  IconButton,
  InputBase,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { fetchAllInstituciones, fetchAtletasByDni } from "@/Api/api";

function InscribirAtleta({ open, onClose, inscriptos }) {
  const [instituciones, setInstituciones] = useState([]);
  const [selectedInstitucion, setSelectedInstitucion] = useState(null);
  const [dni, setDni] = useState("");
  const [cantInscripciones, setCantInscripciones] = useState(0);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAllInstituciones();
        setInstituciones(response.data);
      } catch (error) {
        console.error("Error al obtener las instituciones:", error);
      }
    };

    if (open) {
      fetchData();
    } else {
      setInstituciones([]);
    }
  }, [open]);

  const handleChange = (event, newValue) => {
    setSelectedInstitucion(newValue ? newValue.id : null);
  };

  const handleSearchParticipaciones = () => {
    if (selectedInstitucion && inscriptos) {
      const cant = inscriptos.filter(
        (inscripto) => inscripto.institucion.id === selectedInstitucion
      ).length;
      setCantInscripciones(cant);
    }
  };
  
  const handleSearchDni = async () => {
    if (dni) {
      try {
        const response = await fetchAtletasByDni(dni);
        console.log(response);
      } catch (error) {
        console.error("Error al buscar atletas por DNI:", error);
      }
    }
  }


  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Inscribir atleta</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} height={400}>
          <Grid item xs={4} mt={1}>
            <Autocomplete
              disablePortal
              fullWidth
              id="instituciones"
              options={instituciones}
              getOptionLabel={(option) => option.nombre}
              onChange={handleChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Seleccionar institución"
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item xs={1} mt={1}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              aria-label="search"
              sx={{ height: "55px" }}
              onClick={handleSearchParticipaciones}
            >
              <SearchIcon />
            </Button>
          </Grid>
          <Grid item xs={2} mt={1}>
            <Typography variant="body1">
              Cantidad de participaciones: {cantInscripciones}
            </Typography>
          </Grid>

          <Grid item xs={3} mt={1}>
            <Paper
              fullWidth
              sx={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <InputBase
                sx={{
                  ml: 1,
                  flex: 1,
                  "& input[type=number]": {
                    MozAppearance: "textfield", // Elimina flechas en Firefox
                  },
                  "& input[type=number]::-webkit-outer-spin-button": {
                    WebkitAppearance: "none", // Elimina flechas en Chrome, Safari, Edge, Opera
                    margin: 0,
                  },
                  "& input[type=number]::-webkit-inner-spin-button": {
                    WebkitAppearance: "none", // Elimina flechas en Chrome, Safari, Edge, Opera
                    margin: 0,
                  },
                  height: "55px",
                }}
                placeholder="Buscar DNI"
                inputProps={{ "aria-label": "buscar dni", type: "number" }}
                value={dni}
                onChange={(e) => setDni(e.target.value)}
              />
              <IconButton
                type="button"
                sx={{ p: "10px" }}
                aria-label="buscar-dni"
                onClick={handleSearchDni}
              >
                <SearchIcon />
              </IconButton>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={onClose} variant="contained" color="success">
          Inscribir
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default InscribirAtleta;
