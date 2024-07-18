"use client"
import { useParams } from 'next/navigation';
import { reemplazarGuionesBajos, formatearFecha} from '@/Utils/utils';
import Typography from '@mui/material/Typography';
import { Container, Box, Card, CardContent, CardActionArea, CardMedia, Grid, CircularProgress } from '@mui/material';
import { fetchAllEtapasIdOlimpiada } from '@/Api/api';
import React, { Suspense, useEffect, useState } from 'react';
import CustomLink from '@/components/CustomLink';

const Etapas = () => {
  const params = useParams();
  const { id } = params;
  const [json, setJson] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllEtapasIdOlimpiada(id);
      setJson(data);
    };
    fetchData();
  }, []);


  return (
    <Box>
      {json === null && (
          <CircularProgress />
      )}
      {json && (
        <Box>
      <Typography variant="h3" align="center" mb={2}>Etapas</Typography>
      <Grid container spacing={3} justifyContent="center">
        {json.etapas.map((etapa, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={etapa.id}>
            <Card>
              <CardActionArea>
                <CustomLink href={`/Olimpiada/${json.olimpiada.id}/${etapa.id}`}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {reemplazarGuionesBajos(etapa.region)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Fecha: {formatearFecha(etapa.fecha)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lugar: {etapa.lugar}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Andariveles: {etapa.cantAndariveles}
                    </Typography>
                  </CardContent>
                </CustomLink>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      </Box>
      )}
    </Box>
  );
};

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <Etapas />
        </Suspense>
      </Box>
    </Container>
  );
}
