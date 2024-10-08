import { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Grid,
  TextField,
  Paper,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  Autocomplete,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import {
  fetchAllInstituciones,
  fetchAtletasByDni,
  insertInscripcion,
  insertAtleta,
} from "@/Api/api";

function InscribirAtleta({ open, onClose, inscriptos, prueba }) {
  const [instituciones, setInstituciones] = useState([]);
  const [selectedInstitucion, setSelectedInstitucion] = useState(null);
  const [dni, setDni] = useState("");
  const [cantInscripciones, setCantInscripciones] = useState(0);
  const [atleta, setAtleta] = useState(null);
  const [atletaNoEncontrado, setAtletaNoEncontrado] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAllInstituciones();
        setInstituciones(response.data);
        console.log(prueba);
      } catch (error) {
        console.error("Error al obtener las instituciones:", error);
      }
    };

    if (open) {
      fetchData();
    } else {
      setInstituciones([]);
      setSelectedInstitucion(null);
      setDni("");
      setCantInscripciones(0);
      setAtleta(null);
      setAtletaNoEncontrado(false);
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
        if (response && response.data) {
          const fetchedAtleta = response.data;
          if (fetchedAtleta.sexo !== prueba.sexo) {
            alert("El sexo del atleta no coincide con el sexo de la prueba.");
            setAtleta(null);
            setAtletaNoEncontrado(true);
          } else {
            setAtleta(fetchedAtleta);
            console.log(fetchedAtleta);
            setAtletaNoEncontrado(false);
          }
        } else {
          setAtleta({ dni: dni });
          setAtletaNoEncontrado(true);
        }
      } catch (error) {
        console.error("Error al buscar atletas por DNI:", error);
        setAtleta(null);
        setAtletaNoEncontrado(true);
      }
    }
  };

  // NO FUNCIONA DEL TODO BIEN YA QUE PUEDO INSCRIBIR UN U14 EN U20 O U16
  const verificarCategoriaEdad = (fechaNacimiento, categoria) => {
    const yearActual = new Date().getFullYear();
    const yearNacimiento = new Date(fechaNacimiento).getFullYear();
    const edadAtleta = yearActual - yearNacimiento;

    // Extraemos el número de la categoría (e.g., U14 -> 14)
    const limiteEdad = parseInt(categoria.substring(1));

    // Si la edad del atleta es menor al límite o si cumple la edad límite en el año actual, es válido
    return edadAtleta < limiteEdad;
  };

  const handleInscribirAtleta = async () => {
    try {
      // Si el atleta fue encontrado, inscribirlo directamente
      if (!atletaNoEncontrado) {
        // if (!verificarCategoriaEdad(atleta.fecha, prueba.categoria)) {
        //   alert("El atleta no pertenece a la categoría correcta.");
        //   return;
        // }
        const inscripcion = {
          id: {
            atletaId: atleta.id,
            pruebaId: prueba.id
          },
          atleta: {
            id: atleta.id
          },
          prueba: {
            id: prueba.id
          }
        };
        const response = await insertInscripcion(inscripcion);
        if (response.status === 200) {
          alert("Atleta inscrito exitosamente.");
          onClose();
        } else {
          alert("Error al inscribir al atleta.");
        }
      }
      // Si el atleta no fue encontrado, registrar y luego inscribir
      else {
        if (
          atleta?.nombre &&
          atleta?.apellido &&
          atleta?.dni &&
          atleta?.sexo &&
          atleta?.fecha &&
          selectedInstitucion
        ) {
          // if (!verificarCategoriaEdad(atleta.fecha, prueba.categoria)) {
          //   alert("El atleta no pertenece a la categoría correcta.");
          //   return;
          // }
          // Crear objeto del atleta
          const nuevoAtleta = {
            nombre: atleta.nombre,
            apellido: atleta.apellido,
            dni: atleta.dni,
            sexo: atleta.sexo,
            fecha: atleta.fecha,
            institucion: instituciones.find(
              (i) => i.id === selectedInstitucion
            ),
          };
          console.log(nuevoAtleta);
          const resAtleta = await insertAtleta(nuevoAtleta);
          if (resAtleta.status === 200) {
            const inscripcion = {
              id: {
                atletaId: resAtleta.data.id,
                pruebaId: prueba.id
              },
              atleta: {
                id: resAtleta.data.id
              },
              prueba: {
                id: prueba.id
              }
            };
            const response = await insertInscripcion(inscripcion);
            if (response.status === 200) {
              alert("Atleta registrado e inscrito exitosamente.");
              onClose();
            } else {
              alert("Error al inscribir al atleta.");
            }
          } else {
            alert("Error al registrar al atleta.");
          }
        } else {
          alert("Por favor, complete todos los datos del atleta.");
        }
      }
    } catch (error) {
      console.error("Error en el proceso de inscripción:", error);
      alert("Ocurrió un error durante la inscripción.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Inscribir atleta</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchDni();
                  }
                }}
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
          <Grid item xs={3} mt={1}>
            <TextField
              label="Apellido"
              value={atleta?.apellido || ""}
              onChange={(e) =>
                setAtleta({ ...atleta, apellido: e.target.value })
              }
              fullWidth
              disabled={!atletaNoEncontrado}
            />
          </Grid>
          <Grid item xs={3} mt={1}>
            <TextField
              label="Nombre"
              value={atleta?.nombre || ""}
              onChange={(e) => setAtleta({ ...atleta, nombre: e.target.value })}
              fullWidth
              disabled={!atletaNoEncontrado}
            />
          </Grid>
          <Grid item xs={3} mt={1}>
            <TextField
              label="Fecha de Nacimiento"
              type="date"
              value={atleta?.fecha || ""}
              onChange={(e) => setAtleta({ ...atleta, fecha: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
              disabled={!atletaNoEncontrado}
            />
          </Grid>
          <Grid item xs={3} mt={1}>
            <Typography
              variant="h6"
              color={cantInscripciones > 3 ? "error" : "inherit"}
            >
              Cantidad de participaciones: {cantInscripciones}
            </Typography>
          </Grid>
          <Grid item xs={3} mt={1}>
            <Select
              value={atleta?.sexo || ""}
              onChange={(e) => {
                const selectedSexo = e.target.value;
                if (selectedSexo !== prueba.sexo) {
                  alert(
                    "El sexo seleccionado no coincide con el sexo de la prueba."
                  );
                } else {
                  setAtleta({ ...atleta, sexo: selectedSexo });
                }
              }}
              fullWidth
              displayEmpty
              disabled={!atletaNoEncontrado}
            >
              <MenuItem value="" disabled>
                Sexo
              </MenuItem>
              <MenuItem value="Femenino">Femenino</MenuItem>
              <MenuItem value="Masculino">Masculino</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={5} mt={1}>
            <Autocomplete
              options={instituciones}
              getOptionLabel={(option) => option.nombre}
              value={
                instituciones.find((i) => i.id === atleta?.institucion?.id) ||
                null
              }
              onChange={(e, newValue) => {
                setAtleta({ ...atleta, institucion_id: newValue?.id });
                setSelectedInstitucion(newValue?.id);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Institución" fullWidth />
              )}
              disabled={!atletaNoEncontrado}
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
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button
          onClick={handleInscribirAtleta}
          variant="contained"
          color="success"
        >
          Inscribir
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default InscribirAtleta;
