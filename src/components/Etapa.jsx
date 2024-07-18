"use client";
import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { formatearFecha , reemplazarGuionesBajos} from "@/Utils/utils";
import { fetchEtapaById } from "@/Api/api";

function Etapa({idEtapa}) {

    const [json, setJson] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        const data = await fetchEtapaById(idEtapa);
        setJson(data);
      };
  
      fetchData();
    }, []);

    return (
        <Box>
            {json === null && <CircularProgress />}
            {json && (
                <Box>
                    <Typography variant="h3">
                        {json.olimpiada.nombre}
                    </Typography>
                    <Typography variant="h4">
                        {reemplazarGuionesBajos(json.region)}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default Etapa