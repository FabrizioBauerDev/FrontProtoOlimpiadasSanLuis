
import Typography from '@mui/material/Typography';
import { Container, Box, Card, CardContent, CardActionArea, CardMedia} from '@mui/material'
import { fetchAllOlimpiadas } from '@/Api/api';
import React, { Suspense } from 'react';
import CustomLink from '@/components/CustomLink';

const Olimpiadas = async () => {
  const olimpiadas = await fetchAllOlimpiadas();

  return (
    <Box>
      
      <Typography variant="h3" align="center" mb={2}>Olimpiadas</Typography>

        {olimpiadas.map((olimpiada) => (
          <Card key={olimpiada.id} sx={{ maxWidth: 300 }}>
            <CardActionArea>
              <CustomLink href={"/Olimpiada/"+olimpiada.id}>
                <CardMedia
                  component="img"
                  height="140"
                  image={"https://www.infobae.com/new-resizer/gFuAyMv7bui6KOWjIaMNwyu49po=/992x558/filters:format(webp):quality(85)/cloudfront-us-east-1.images.arcpublishing.com/infobae/VGPEBRBO2FA6NG3AXGIGJ6HNDQ.jpg"}
                  alt={olimpiada.id}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {olimpiada.anio}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {olimpiada.nombre}
                  </Typography>
                </CardContent>
              </CustomLink>
            </CardActionArea>
          </Card>

        ))}
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
          <Olimpiadas />
        </Suspense>
      </Box>
    </Container>
  );
}
