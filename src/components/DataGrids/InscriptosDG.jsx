import * as React from "react";
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
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { addDays } from "date-fns";
import { deleteInscriptos } from "@/Api/api";

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

export default function App({ inscriptos, setInscriptos, pruebaId }) {
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  const rows = inscriptos.map((inscripto) => ({
    id: inscripto.id,
    nombre: inscripto.nombre,
    apellido: inscripto.apellido,
    dni: inscripto.dni,
    fechaDeNacimiento: addDays(new Date(inscripto.fecha), 1),
    institucion: inscripto.institucion.nombre,
  }));

  const handleDelete = () => {
    if (selectionModel.length > 0) {
      setOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
  console.log("Inscripciones a eliminar:", selectionModel);
  const inscripcionesAEliminar = selectionModel.map((row) => ({
    atletaId: row.id,
    pruebaId: pruebaId,
  }));

  // Llamar a la API para eliminar las inscripciones
  const response = await deleteInscriptos(inscripcionesAEliminar);

  // if (response.status === 200) {  // Verifica si la respuesta es exitosa
  //   // Filtra las filas que se eliminaron
  //   const updatedRows = rows.filter(
  //     (row) => !selectionModel.includes(row)
  //   );
  //   setSelectionModel([]); // Reinicia la selección
  //   setInscriptos(updatedRows);  // Actualiza las filas con las eliminadas removidas
  // }

  alert(response.data);
  setOpen(false);
};

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={selectionModel.length === 0}
          >
            Eliminar atletas
          </Button>
        </Grid>
      </Grid>
      <Box style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          disableSelectionOnClick
            onRowSelectionModelChange={(newSelection) => {
              const selectedRows = rows.filter((row) =>
                newSelection.includes(row.id)
              );
              setSelectionModel(selectedRows);
            }}
          slots={{ toolbar: CustomToolbar }}
        />
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {`¿Está seguro de eliminar ${selectionModel.length} inscripción(es)?`}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleConfirmDelete} color="error">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
