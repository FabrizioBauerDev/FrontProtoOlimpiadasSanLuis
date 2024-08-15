"use client";
import { useParams } from "next/navigation";
import InscriptosPruebas from "@/components/InscriptosPruebas";
import { Container, Box, CircularProgress, Typography } from "@mui/material";
import {reemplazarGuionesBajos} from "@/Utils/utils";
import React, { Suspense, useEffect, useState } from "react";
import { fetchEtapaById } from "@/Api/api";

export default function Home() {
  const params = useParams();
  const { id, idEtapa } = params;
  const [etapa, setEtapa] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchEtapaById(idEtapa);
      setEtapa(data);
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box align="center">
        <Suspense fallback={<CircularProgress />}>
          {etapa === null && <CircularProgress />}
          {etapa && (
            <Box sx={{ m: 2 }}>
              <Typography variant="h3">{etapa.olimpiada.nombre}</Typography>
              <Typography variant="h4">
                {reemplazarGuionesBajos(etapa.region)} ({etapa.cantAndariveles})
              </Typography>
            </Box>
          )}
        </Suspense>
      </Box>
      <Box>
        <Suspense>
          <InscriptosPruebas idEtapa={idEtapa} />
        </Suspense>
      </Box>
    </Container>
  );
}
