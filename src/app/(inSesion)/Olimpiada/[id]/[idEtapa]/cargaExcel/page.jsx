"use client";
import { useParams } from "next/navigation";
import {
  Container,
  Box,
  CircularProgress,
  Typography,
  Button,
  Input,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Grid,
  FormControl,
} from "@mui/material";
import { reemplazarGuionesBajos } from "@/Utils/utils";
import React, { Suspense, useEffect, useState } from "react";
import { fetchEtapaById, uploadExcel } from "@/Api/api";
import { capitalizeWords } from "@/Utils/utils";
import ExcelJS from "exceljs";
import DeleteIcon from "@mui/icons-material/Delete";
import { format, addDays} from "date-fns";

export default function Page() {
  const params = useParams();
  const { id, idEtapa } = params;
  const [etapa, setEtapa] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [region, setRegion] = useState("");
  const [institucion, setInstitucion] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchEtapaById(idEtapa);
      setEtapa(data);
    };

    fetchData();
  }, [idEtapa]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);

      const worksheet = workbook.getWorksheet(1);
      const jsonData = [];

      let rowIndex = 7;

      for (let i = 0; i < 6; i++) {
        // Iteramos 6 veces
        const combinedRow = worksheet.getRow(rowIndex);
        let datos = {};
        datos.categoria= combinedRow.values.at(1).split(" ")[0],
        datos.sexo= capitalizeWords(combinedRow.values.at(1).split(" ")[1]),
        datos.atletas= [],
        rowIndex++;
        // Omitir la siguiente fila
        rowIndex++;
        // Leer mientras haya pruebas
        let row = worksheet.getRow(rowIndex);
        while(row.values.at(2) !== undefined){
        // for (let j = 0; j < 16; j++) {
          const apellido = capitalizeWords(row.values.at(3));
          const nombre = capitalizeWords(row.values.at(4));
          // Verificar si apellido o nombre están vacíos o son undefined
          if (apellido && nombre) {
            console.log(apellido+ " "+ nombre);
            datos.atletas.push({
              prueba: row.values.at(2).toLowerCase().replaceAll(" ",""),
              apellido: apellido,
              nombre: nombre,
              dni: row.values.at(6),
              f_nacimiento: format(addDays(new Date(row.values.at(7)), 1), "dd/MM/yyyy"),
            });
          }
          rowIndex++;
          row = worksheet.getRow(rowIndex);
        }
        // Omitir la siguiente fila
        rowIndex++;
        jsonData.push(datos);
      }
      setExcelData(jsonData);
      console.log(jsonData);
    };
    reader.readAsArrayBuffer(file);
    setSelectedFile(file); // Guardamos el archivo seleccionado
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setExcelData(null);
  };

  const handleSubmit = async () => {
    if (excelData) {
      if(etapa.region === region){
        try {
          let data = {};
          data.excelData = excelData;
          data.region = region;
          data.institucion = institucion;
          const response = await uploadExcel(etapa.olimpiada.id , etapa.id, data);
          alert(response.data);
          // Limpiar los campos para poder realizar una nueva carga
          setRegion("");
          setInstitucion("");
          setSelectedFile(null);
          setExcelData(null);
        } catch (error) {
          console.error("Error al enviar los datos", error);
        }
      }
      else{
        alert("La región seleccionada no coincide con la región de la etapa");
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box align="center">
        <Suspense fallback={<CircularProgress />}>
          {etapa === null && <CircularProgress />}
          {etapa && (
            <Box>
              <Box sx={{ m: 2 }}>
                <Typography variant="h3">{etapa.olimpiada.nombre}</Typography>
                <Typography variant="h4">
                  {reemplazarGuionesBajos(etapa.region)} (
                  {etapa.cantAndariveles})
                </Typography>
              </Box>
              <Box>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <FormControl fullWidth>
                      <Select
                        labelId="selectRegion"
                        id="selectR"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        displayEmpty
                        fullWidth
                      >
                        <MenuItem value="" disabled>
                          Selecciona una región
                        </MenuItem>
                        <MenuItem value="Llanura_Norte">Llanura Norte</MenuItem>
                        <MenuItem value="Capital">Capital</MenuItem>
                        <MenuItem value="Llanura_Sur">Llanura Sur</MenuItem>
                        <MenuItem value="Valle_del_Conlara">
                          Valle del Conlara
                        </MenuItem>
                        <MenuItem value="Pedernera">Pedernera</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="Nombre de la Institución"
                      value={institucion}
                      onChange={(e) => setInstitucion(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {!selectedFile && (
                        <>
                          <input
                            type="file"
                            onChange={handleFileUpload}
                            accept=".xlsx, .xls"
                            style={{ display: "none" }}
                            id="upload-file-input"
                          />
                          <label htmlFor="upload-file-input">
                            <Button
                              variant="contained"
                              color="primary"
                              component="span"
                            >
                              Seleccionar Archivo
                            </Button>
                          </label>
                        </>
                      )}
                      {selectedFile && (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography>{selectedFile.name}</Typography>
                          <IconButton
                            onClick={handleFileRemove}
                            color="error"
                            sx={{ ml: 1 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                disabled={!excelData || !region || !institucion}
                sx={{ mt: 2 }}
              >
                Subir Archivo
              </Button>
            </Box>
          )}
        </Suspense>
      </Box>
    </Container>
  );
}
