import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import {
  Box,
  TextField,
  IconButton,
  FormControl,
  Grid,
  Button,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import React, { useState, useEffect } from "react";
import {
  fetchParticipacionesBySerieId,
  fetchParticipacionesByPruebaId,
  updateVientoSerie,
  multipleUpdateParticipa,
} from "@/Api/api";
import SortearAndariveles from "@/components/Dialogs/SortearAndariveles";
import CrearFinal from "@/components/Dialogs/CrearFinal";
import PlanillaResultSeries from "@/components/PDF/PlanillaResultSeries";
import PlanillaVaciaLanzamientos from "@/components/PDF/PlanillaVaciaLanzamientos";
import SelectAthlete from "@/components/Dialogs/SelectAthlete";
import { pdf } from "@react-pdf/renderer";
import { comparadorDinamico } from "@/Utils/utils";
import { addDays} from "date-fns";

// Componente personalizado de la barra de herramientas
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport
        csvOptions={{
          fileName: "Inscriptos",
        }}
        printOptions={{
          fileName: "Inscriptos",
          hideFooter: true,
          hideToolbar: true,
        }}
      />
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
}

// Componente principal
export default function App({ serie, serieId, prueba, emptyFinals }) {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [viento, setViento] = useState(false); // Estado inicial en modo no editable
  const [value, setValue] = useState(""); // Estado para el valor del TextField
  const [originalValue, setOriginalValue] = useState(""); // Estado para comparar cambios
  const [openSorteo, setOpenSorteo] = useState(false);
  const [openFinales, setOpenFinales] = useState(false);
  const [editable, setEditable] = useState(false);
  const [addAthlete, setAddAthlete] = useState(false);

  const regexCarreras = /^(\d{1,2}:\d{2}\.\d{2}|\d{1,2}\.\d{2,3})$/;
  const regexSaltosLanzamientos = /^\d{1,2}\.\d{2}m$/;
  const regexPuesto = /^([1-9]|[1-9][0-9])$/;

  useEffect(() => {
    const fetchRows = async () => {
      try {
        let data;
        let columns = [
          { field: "ayn", headerName: "Apellido y Nombre", flex: 0.5 },
          {
            field: "fechaDeNacimiento",
            headerName: "Nacimiento",
            flex: 0.2,
            type: "date",
          },
          { field: "institucion", headerName: "Institución", flex: 0.5 },
        ];
        if (prueba.tipo === "SaltosHorizontales") {
          columns = columns.concat({
            field: "viento",
            headerName: "Viento",
            flex: 0.2,
          });
        }
        if (
          prueba.tipo === "PistaConAndarivel" ||
          prueba.tipo === "PistaSinAndarivel"
        ) {
          columns = columns.concat({
            field: "and",
            headerName: "And",
            flex: 0.2,
            editable: editable,
          });
        }
        if (serieId === 0) {
          data = await fetchParticipacionesByPruebaId(prueba.id);
          columns = columns.concat({
            field: "serie",
            headerName: "Serie",
            flex: 0.2,
          });
        } else {
          data = await fetchParticipacionesBySerieId(serieId);
        }
        columns = columns.concat([
          {
            field: "marca",
            headerName: "Marca",
            flex: 0.2,
            editable: editable,
            sortComparator: (marcaA, marcaB) =>
              comparadorDinamico(marcaA, marcaB, prueba.tipo),
          },
          {
            field: "puesto",
            headerName: "Puesto",
            flex: 0.2,
            editable: editable,
          },
        ]);
        setData(data);
        const rows = data
          .map((participacion, index) => ({
            id: index,
            idAtleta: participacion.atleta.id,
            ayn: `${participacion.atleta.apellido} ${participacion.atleta.nombre}`,
            fechaDeNacimiento: addDays(new Date(participacion.atleta.fecha), 1),
            institucion: participacion.atleta.institucion.nombre,
            and: participacion.andarivel === 0 ? null : participacion.andarivel,
            marca: participacion.marca,
            puesto: participacion.puesto === 0 ? null : participacion.puesto,
            serie: participacion.nombreSerie,
            viento: participacion.viento,
          }))
          .sort((a, b) => {
            if (a.and === null) return 1;
            if (b.and === null) return -1;
            return a.and - b.and;
          });
        // En caso de estar cargados los puestos, ordenar por puesto
        if (rows[0]?.puesto != null) {
          rows.sort((a, b) => {
            if (a.puesto === null) return 1;
            if (b.puesto === null) return -1;
            return a.puesto - b.puesto;
          });
        }
        setColumns(columns);
        setRows(rows);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };
    setValue(serie?.viento || ""); // Inicializar el valor del TextField
    fetchRows();
  }, [serieId, prueba.id, editable]);

  useEffect(() => {
    setEditable(false);
  }, [serieId]);

  useEffect(() => {
    const rows = data
      .map((participacion, index) => ({
        id: index,
        idAtleta: participacion.atleta.id,
        ayn: `${participacion.atleta.apellido} ${participacion.atleta.nombre}`,
        fechaDeNacimiento: addDays(new Date(participacion.atleta.fecha), 1),
        institucion: participacion.atleta.institucion.nombre,
        and: participacion.andarivel === 0 ? null : participacion.andarivel,
        marca: participacion.marca,
        puesto: participacion.puesto === 0 ? null : participacion.puesto,
        serie: participacion.nombreSerie,
        viento: participacion.viento,
      }))
      .sort((a, b) => {
        if (a.and === null) return 1;
        if (b.and === null) return -1;
        return a.and - b.and;
      });
    // En caso de estar cargados los puestos, ordenar por puesto
    if (rows[0]?.puesto != null) {
      rows.sort((a, b) => {
        if (a.puesto === null) return 1;
        if (b.puesto === null) return -1;
        return a.puesto - b.puesto;
      });
    }
    setRows(rows);
  }, [data]);

  const handleEditToggle = async () => {
    if (viento) {
      // Validar el formato de entrada
      const isValid = value === "" || /^(\+|\-)\d\.\d$/.test(value);
      if (!isValid) {
        alert(
          "El valor debe estar vacío o tener el formato '+d.d' donde d es un dígito."
        );
        return;
      }
      // Verificar si el valor cambió
      if (value !== originalValue) {
        try {
          const res = await updateVientoSerie(serie, value);
          // Mostrar mensaje de éxito
          alert("Viento de la serie actualizado correctamente.");
        } catch (error) {
          alert("Error al actualizar el viento de la serie.");
          setValue(originalValue); // Restaurar el valor original
          console.error("Error al actualizar el viento de la serie:", error);
        }
        setOriginalValue(value); // Actualizar el valor original después del POST
      }
    }

    setViento(!viento); // Cambiar el modo de edición
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleClickOpen = () => {
    setOpenSorteo(true);
  };

  const handleClose = () => {
    setOpenSorteo(false);
  };

  const handleClickOpenFinales = () => {
    setOpenFinales(true);
  };

  const handleCloseFinales = () => {
    setOpenFinales(false);
  };

  const processRowUpdate = (newRow, oldRow) => {
    const updatedRows = rows.map((row) =>
      row.id === oldRow.id ? newRow : row
    );
    setRows(updatedRows);
    return newRow;
  };

  const handleEditPlanilla = async () => {
    if (!editable) {
      setEditable(true);
      alert("Editando planilla");
    } else {
      // Controlar los valores de las celdas
      let isValid = true;
      let isPuestoValid = true;

      rows.forEach((row) => {
        // Validar el tipo de prueba
        if (
          prueba.tipo === "PistaConAndarivel" ||
          prueba.tipo === "PistaSinAndarivel"
        ) {
          // Carreras d.dd o dd.dd o d:dd.dd o dd:dd.dd
          if (row.marca != null && !regexCarreras.test(row.marca)) {
            isValid = false;
            alert("Marca incorrecta: " + row.marca + ". Atleta: " + row.ayn);
          }
        } else if (
          prueba.tipo === "SaltoEnAlto" ||
          prueba.tipo === "SaltosHorizontales" ||
          prueba.tipo === "Lanzamientos"
        ) {
          // Saltos horizontales y lanzamientos d.ddm o dd.ddm
          if (row.marca != null && !regexSaltosLanzamientos.test(row.marca)) {
            isValid = false;
          }
        }
        if (row.puesto != null && !regexPuesto.test(row.puesto)) {
          isPuestoValid = false;
        }
      });
      if (isValid && isPuestoValid) {
        // Tomar data y agregarle los valores de las celdas
        const participaciones = data.map((participacion) => {
          const updatedRow = rows.find(
            (row) => row.idAtleta === participacion.atleta.id
          );
          if (updatedRow) {
            return {
              ...participacion,
              andarivel: updatedRow.and,
              marca: updatedRow.marca,
              puesto: updatedRow.puesto,
              viento: updatedRow.viento,
            };
          }
          return participacion;
        });
        // Enviar los datos al backend
        const res = await multipleUpdateParticipa(serieId, participaciones);
        setEditable(false);
      } else {
        alert(
          "Algunos valores son incorrectos. Por favor, revisa la planilla."
        );
        return;
      }
    }
  };

  const handlePrint = async (Component, props) => {
    const doc = <Component {...props} />;
    const asPdf = pdf(doc);
    const blob = await asPdf.toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  const handleAddAthleteOpen = () => {
    setAddAthlete(true);
  };

  const handleAddAthleteClose = () => {
    setAddAthlete(false);
  };

  return (
    <Box>
      <Box>
        {serieId === 0 && emptyFinals && (
          <Grid container spacing={2} my={1} alignItems="center">
            <Grid item xs={2}>
              <Button
                onClick={handleClickOpenFinales}
                color="success"
                variant="contained"
              >
                Generar Finales
              </Button>
              <CrearFinal
                open={openFinales}
                handleClose={handleCloseFinales}
                prueba={prueba}
              />
            </Grid>
          </Grid>
        )}
        {serieId > 0 && (
          <Grid container spacing={2} my={1} alignItems="center">
            {prueba.tipo === "PistaConAndarivel" && (
              <Grid item xs={1}>
                <FormControl fullWidth>
                  <TextField
                    label="Viento"
                    variant="outlined"
                    value={value}
                    onChange={handleChange}
                    disabled={!viento}
                    fullWidth
                  />
                </FormControl>
              </Grid>
            )}
            {prueba.tipo === "PistaConAndarivel" && (
              <Grid item xs={1}>
                <IconButton
                  onClick={handleEditToggle}
                  color={viento ? "success" : "error"}
                >
                  {viento ? <CheckIcon /> : <EditIcon />}
                </IconButton>
              </Grid>
            )}
            {prueba.tipo === "PistaConAndarivel" &&
              data[0]?.andarivel === 0 && (
                <Grid item xs={2}>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={handleClickOpen}
                  >
                    Sortear andariveles
                  </Button>
                  <SortearAndariveles
                    open={openSorteo}
                    handleClose={handleClose}
                    cantAtletas={rows.length}
                    participaciones={data}
                    setParticipaciones={setData}
                  />
                </Grid>
              )}
            <Grid item xs={2}>
              <Button
                variant="contained"
                color={editable ? "success" : "error"}
                onClick={handleEditPlanilla}
              >
                {editable ? "Guardar planilla" : "Editar planilla"}
              </Button>
            </Grid>
            {(prueba.tipo === "Lanzamientos" ||
              prueba.tipo === "SaltosHorizontales") && (
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    handlePrint(PlanillaVaciaLanzamientos, { rows, serie })
                  }
                  endIcon={<PrintIcon />}
                >
                  Planilla vacía
                </Button>
              </Grid>
            )}
            {serie.instancia === "Final" && (
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleAddAthleteOpen}
                  endIcon={<AddIcon />}
                >
                  Añadir atletas
                </Button>
                <SelectAthlete
                  open={addAthlete}
                  handleClose={handleAddAthleteClose}
                  prueba={prueba}
                  serieId={serieId}
                  participaciones={data}
                  setParticipaciones={setData}
                />
              </Grid>
            )}
            <Grid item xs={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  handlePrint(PlanillaResultSeries, { rows, serie })
                }
                endIcon={<PrintIcon />}
              >
                Abrir PDF
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>
      <Box my={1} style={{ height: 450, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          slots={{ toolbar: CustomToolbar }}
          processRowUpdate={processRowUpdate}
          sortingOrder={["desc", "asc"]}
        />
      </Box>
    </Box>
  );
}
