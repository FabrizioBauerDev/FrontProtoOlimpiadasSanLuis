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
  fetchParticipacionesByPruebaId,
  multipleCreateParticipa,
} from "@/Api/api";
import { comparadorDinamico } from "@/Utils/utils";

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

export default function SortearAndariveles({
  open,
  handleClose,
  prueba,
  serieId,
  participaciones,
  setParticipaciones,
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
            });
          }
          data = await fetchParticipacionesByPruebaId(prueba.id);
          // Filtramos los datos para que no aparezcan atletas 
          // que ya estan en la final o que participan en otra final.
          data = data.filter((participacion) => {
            const atletaNoParticipa = !participaciones.some(
              (p) => p.id.atletaId === participacion.atleta.id
            );
            const noEsFinal = !participacion.nombreSerie.startsWith("Final");
            return atletaNoParticipa && noEsFinal;
          });
          columns = columns.concat({
            field: "serie",
            headerName: "Serie",
            flex: 0.2,
          });
          columns = columns.concat([
            {
              field: "marca",
              headerName: "Marca",
              flex: 0.2,
              sortComparator: (marcaA, marcaB) =>
                comparadorDinamico(marcaA, marcaB, prueba.tipo),
            },
            {
              field: "puesto",
              headerName: "Puesto",
              flex: 0.2,
            },
          ]);
          setData(data);
          const rows = data.map((participacion,index) => ({
            id: index,
            idAtleta: participacion.atleta.id,
            ayn: `${participacion.atleta.nombre} ${participacion.atleta.apellido}`,
            fechaDeNacimiento: new Date(participacion.atleta.fecha),
            institucion: participacion.atleta.institucion.nombre,
            and: participacion.andarivel === 0 ? null : participacion.andarivel,
            marca: participacion.marca,
            puesto: participacion.puesto === 0 ? null : participacion.puesto,
            serie: participacion.nombreSerie,
            viento: participacion.viento,
          }));
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
    const res = await multipleCreateParticipa(
      serieId,
      selectedAthletes.map((athlete) => athlete.idAtleta)
    );
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>Crear Finales</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Seleccione los atletas que desea enviar a la final.
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
