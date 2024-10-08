"use client";
import { useParams } from "next/navigation";
import {
  Container,
  Box,
  CircularProgress,
  Typography,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import { reemplazarGuionesBajos, formatearFecha } from "@/Utils/utils";
import React, { Suspense, useEffect, useState } from "react";
import { fetchEtapaById, fetchReportByEtapaId } from "@/Api/api";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { addDays} from "date-fns";

export default function Page() {
  const params = useParams();
  const { id, idEtapa } = params;
  const [etapa, setEtapa] = useState(null);
  const [archivo, setArchivo] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchEtapaById(idEtapa);
      setEtapa(data);
    };

    fetchData();
  }, [idEtapa]);

  const handleSubmit = async () => {
    const response = await fetchReportByEtapaId(idEtapa);
    const pruebas = response.resultPruebas;

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: response.etapa.olimpiada.nombre,
                  bold: true,
                  underline: true,
                  size: 40,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Región: ${reemplazarGuionesBajos(
                    response.etapa.region
                  )}`,
                  bold: true,
                  size: 24,
                  font: "Calibri",
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Lugar: ${response.etapa.lugar}`,
                  bold: true,
                  size: 24,
                  font: "Calibri",
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Fecha: ${formatearFecha(response.etapa.fecha)}`,
                  bold: true,
                  size: 24,
                  font: "Calibri",
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Los valores presentados en el siguiente informe son: Posición del atleta en la serie o final, andarivel (solo en 80mts y 100mts), apellido y nombre, año de nacimiento, nombre de institución y  marca o condición en la prueba.",
                  italics: true,
                  size: 22,
                  font: "Calibri",
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Aclaración de abreviaturas de condición: DQ (descalificado), DNS (no inició la prueba), DNF (no finalizó la prueba), NM (sin marca), FP(fuera de prueba).\n`,
                  italics: true,
                  size: 22,
                  font: "Calibri",
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Los atletas resaltados son los clasificados a la final provincial.\n`,
                  italics: true,
                  size: 22,
                  font: "Calibri",
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Resultados:",
                  bold: true,
                  underline: true,
                  size: 32,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),

            // Iterar sobre cada prueba
            ...pruebas.flatMap((prueba) => {
              // Agrupamos las participaciones por `nombreSerie`
              const participacionesPorSerie = prueba.participacionesDTO.reduce(
                (acc, participacion) => {
                  if (!acc[participacion.nombreSerie]) {
                    acc[participacion.nombreSerie] = [];
                  }
                  acc[participacion.nombreSerie].push(participacion);
                  return acc;
                },
                {}
              );

              // Creamos párrafos para cada serie
              return Object.keys(participacionesPorSerie).flatMap(
                (nombreSerie) => [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `\n`,
                      }),
                    ],
                  }),
                  new Paragraph({
                    thematicBreak: true,
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `Prueba: ${prueba.pruebaDTO.nombre} - ${prueba.pruebaDTO.categoria} - ${prueba.pruebaDTO.sexo} - ${nombreSerie}`,
                        bold: true,
                        size: 24,
                      }),
                    ],
                  }),
                  new Paragraph({
                    thematicBreak: true,
                  }),
                  // Iterar sobre las participaciones de esa serie
                  ...participacionesPorSerie[nombreSerie].map(
                    (participacion) => {
                      const atleta = participacion.atleta;
                      const anioNacimiento = addDays(new Date(atleta.fecha), 1).getFullYear();
                      if(prueba.pruebaDTO.tipo === "PistaConAndarivel"){
                        return new Paragraph({
                          children: [
                            new TextRun({
                              text: `${participacion.puesto < 10 ? '0' + participacion.puesto : participacion.puesto}    ${participacion.andarivel}    ${atleta.apellido} ${atleta.nombre}\t\t${anioNacimiento}\t${atleta.institucion.nombre}\t\t\t${participacion.marca}`,
                              size: 20,
                            }),
                          ],
                        });
                      }
                      else{
                        return new Paragraph({
                          children: [
                            new TextRun({
                              text: `${participacion.puesto < 10 ? '0' + participacion.puesto : participacion.puesto}\t${atleta.apellido} ${atleta.nombre}\t\t${anioNacimiento}\t${atleta.institucion.nombre}\t\t\t${participacion.marca}`,
                              size: 20,
                            }),
                          ],
                        });
                      }
                    }
                  ),
                ]
              );
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${archivo}.docx`);
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
              <Box mt={3}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <TextField
                      label="Nombre del archivo"
                      value={archivo}
                      onChange={(e) => setArchivo(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Button
                      onClick={handleSubmit}
                      variant="contained"
                      size="large"
                      color="primary"
                      disabled={!archivo}
                      fullWidth
                    >
                      Generar reporte
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </Suspense>
      </Box>
    </Container>
  );
}
