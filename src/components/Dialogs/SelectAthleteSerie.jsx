import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Button,
} from "@mui/material";
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
  fetchInscriptosByPruebaId,
  multipleCreateParticipa,
} from "@/Api/api";
import { addDays } from "date-fns";

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


export default function SelectAthleteSerie({
  open,
  handleClose,
  prueba,
  serieId,
}) {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [selectedAthletes, setSelectedAthletes] = useState([]);

  useEffect(() => {
    if (open) {
      const fetchRows = async () => {
        try {
          let data;
          data = await fetchInscriptosByPruebaId(prueba.id);

          setData(data);
          const rows = data.map((inscripto) => ({
            id: inscripto.id,
            nombre: inscripto.nombre,
            apellido: inscripto.apellido,
            dni: inscripto.dni,
            fechaDeNacimiento: addDays(new Date(inscripto.fecha), 1),
            institucion: inscripto.institucion.nombre,
          }));

          const columns = [
            { field: "nombre", headerName: "Nombre", flex: 0.5 },
            { field: "apellido", headerName: "Apellido", flex: 0.5 },
            { field: "dni", headerName: "DNI", flex: 0.5 },
            {
              field: "fechaDeNacimiento",
              headerName: "Nacimiento",
              flex: 0.5,
              type: "date",
            },
            { field: "institucion", headerName: "Institución", flex: 1 },
          ];
          setColumns(columns);
          setRows(rows);
        } catch (error) {
          console.error("Error al obtener los datos:", error);
        }
      };
      fetchRows();
    } else {
      setRows([]);
      setColumns([]);
      setData([]);
    }
  }, [open]);

  const handleAdd = async () => {
    console.log("Atletas seleccionados:", selectedAthletes);
    const res = await multipleCreateParticipa(
      serieId,
      selectedAthletes.map((athlete) => athlete.id)
    );
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>Añadir atletas</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Seleccione los atletas que desea enviar a la serie.
        </DialogContentText>
        <Box my={1} style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            slots={{ toolbar: CustomToolbar }}
            sortingOrder={["desc", "asc"]}
            checkboxSelection
            disableSelectionOnClick
            onRowSelectionModelChange={(newSelection) => {
              const selectedRows = rows.filter((row) =>
                newSelection.includes(row.id)
              );
              setSelectedAthletes(selectedRows);
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
        <Button color="success" variant="contained" onClick={handleAdd}>
          Añadir atletas
        </Button>
      </DialogActions>
    </Dialog>
  );
}
