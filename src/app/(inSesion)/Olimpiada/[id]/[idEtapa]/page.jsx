"use client";
import { useParams } from "next/navigation";
import Etapa from "@/components/Etapa";
import InscriptosPruebas from "@/components/InscriptosPruebas";
import { Container, Box, CircularProgress } from "@mui/material";
import React, { Suspense, useEffect, useState } from "react";

export default function Home() {
  const params = useParams();
  const { id, idEtapa } = params;

  return (
    <Container maxWidth="lg">
      <Box align="center">
        <Suspense fallback={<CircularProgress />}>
          <Etapa idEtapa={idEtapa} />
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
