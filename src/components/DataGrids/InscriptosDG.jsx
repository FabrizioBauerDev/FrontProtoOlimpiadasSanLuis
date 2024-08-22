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
import { Box } from "@mui/material";
import { addDays} from "date-fns";

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

export default function App({ inscriptos }) {
  const rows = inscriptos.map((inscripto) => ({
    id: inscripto.id,
    nombre: inscripto.nombre,
    apellido: inscripto.apellido,
    dni: inscripto.dni,
    fechaDeNacimiento: addDays(new Date(inscripto.fecha),1),
    institucion: inscripto.institucion.nombre,
  }));

  return (
    <Box style={{ height: 450, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        slots={{ toolbar: CustomToolbar }}
      />
    </Box>
  );
}
