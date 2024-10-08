import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { format, addDays } from "date-fns";
import {
  reemplazarGuionesBajos,
  formatNombrePrueba,
  formatearFecha,
} from "@/Utils/utils";

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
    fontSize: 10,
    paddingBottom: 40, // Reserva espacio para el footer
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  image: {
    height: 60,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 5,
  },
  testName: {
    fontSize: 16,
    marginBottom: 10,
  },
  testName2: {
    fontSize: 12,
    marginBottom: 10,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 0, // Eliminamos los bordes externos
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0, // Sin borde izquierdo
    borderTopWidth: 0, // Sin borde superior
    backgroundColor: "#eee",
    padding: 5,
    alignItems: "center",
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0, // Sin borde izquierdo
    borderTopWidth: 0, // Sin borde superior
    padding: 5,
  },
  tableCellHeader: {
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 20, // Distancia desde la parte inferior de la página
    left: 20,
    right: 20,
    textAlign: "center",
    fontSize: 10,
  },
});

// Componente PDF
const PlanillaResultSeries = ({ inscriptos, prueba }) => {
  // Anchos específicos de las columnas
  const columnWidths = {
    nro: "4%",
    ayn: "44%",
    nacimiento: "8%",
    institucion: "44%",
  };

  return (
    <Document>
      <Page size="A4" orientation="portrait" style={styles.page}>
        {/* Header con 3 imágenes */}
        <View style={styles.header}>
          <Image style={styles.image} src="/Images/1__FAS-sin-fondo.png" />
          <Image
            style={styles.image}
            src="/Images/2__OLIMPIADAS-ATLETISMO-sin-fondo.png"
          />
          <Image
            style={styles.image}
            src="/Images/3__GOB.SAN-LUIS sin-fondo.png"
          />
        </View>
        {/* Título y Nombre de la Prueba */}
        <View fixed>
          <Text style={styles.title}>{prueba.etapa.olimpiada.nombre}</Text>
          <Text style={styles.subtitle}>
            Etapa: {reemplazarGuionesBajos(prueba.etapa.region)}
          </Text>
          <Text style={styles.testName}>
            Inscriptos: {formatNombrePrueba(prueba.nombre)} - {prueba.sexo} -{" "}
            {prueba.categoria}
          </Text>
          <Text style={styles.testName2}>
            Fecha: {formatearFecha(prueba.etapa.fecha)}{" "}
          </Text>
        </View>
        {/* Tabla con datos */}
        <View style={styles.table}>
          {/* Fila de encabezado */}
          <View style={styles.tableRow} fixed>
            <View style={{ ...styles.tableColHeader, width: columnWidths.nro }}>
              <Text style={styles.tableCellHeader}>N°</Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: columnWidths.ayn }}>
              <Text style={styles.tableCellHeader}>Apellido y Nombre</Text>
            </View>
            <View
              style={{
                ...styles.tableColHeader,
                width: columnWidths.nacimiento,
              }}
            >
              <Text style={styles.tableCellHeader}>Año</Text>
            </View>
            <View
              style={{
                ...styles.tableColHeader,
                width: columnWidths.institucion,
              }}
            >
              <Text style={styles.tableCellHeader}>Institución</Text>
            </View>
          </View>
          {/* Filas dinámicas */}
          {inscriptos.map((inscripto, index) => (
            <View wrap={false} key={index}>
              <View style={styles.tableRow}>
                <View style={{ ...styles.tableCol, width: columnWidths.nro }}>
                  <Text style={styles.tableCell}>
                    {index+1}
                  </Text>
                </View>
                <View style={{ ...styles.tableCol, width: columnWidths.ayn }}>
                  <Text style={styles.tableCell}>
                    {inscripto.apellido + " " + inscripto.nombre}
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol,
                    width: columnWidths.nacimiento,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ ...styles.tableCell, textAlign: "center" }}>
                    {format(addDays(new Date(inscripto.fecha), 1), "yyyy")}
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol,
                    width: columnWidths.institucion,
                  }}
                >
                  <Text style={styles.tableCell}>
                    {inscripto.institucion.nombre}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.footer} fixed>
          <Text
            style={{
              textAlign: "center",
              fontSize: 10,
            }}
            render={({ pageNumber, totalPages }) =>
              `Página ${pageNumber} de ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
};

export default PlanillaResultSeries;
