import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { format } from "date-fns";
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
    marginBottom: 20,
  },
  image: {
    width: 50,
    height: 50,
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
  // tableCell: {
  //   height: 22,
  // },
});

// Componente PDF
const PlanillaResultSeries = ({ rows, serie }) => {
  // Anchos específicos de las columnas
  const columnWidths = {
    ayn: "33%",
    nacimiento: "10%",
    institucion: "35%",
    and: "6%", // Este se usa solo cuando sea necesario
    marca: "10%",
    puesto: serie.prueba.tipo === "Lanzamientos" ? "12%" : "6%", // Ajuste dinámico
  };

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header con 3 imágenes */}
        <View style={styles.header}>
          <Image style={styles.image} src="/Images/logoFAS.jpg" />
          <Image style={styles.image} src="/Images/logoFAS.jpg" />
          <Image style={styles.image} src="/Images/logoOlimpiadas.jpeg" />
        </View>
        {/* Título y Nombre de la Prueba */}
        <View fixed>
          <Text style={styles.title}>
            {serie.prueba.etapa.olimpiada.nombre}
          </Text>
          <Text style={styles.subtitle}>
            Región: {reemplazarGuionesBajos(serie.prueba.etapa.region)}
          </Text>
          <Text style={styles.testName}>
            {formatNombrePrueba(serie.prueba.nombre)} - {serie.prueba.sexo} -{" "}
            {serie.prueba.categoria} - {serie.nombre}
          </Text>
          <Text style={styles.testName2}>
            Fecha: {formatearFecha(serie.prueba.etapa.fecha)}{" "}
            {serie.hora !== null && `Hora: ${serie.hora}`}
            {serie.prueba.tipo === "PistaConAndarivel" &&
              serie.viento !== null &&
              `     Viento: ${serie.viento} mts/seg`}
          </Text>
        </View>
        {/* Tabla con datos */}
        <View style={styles.table}>
          {/* Fila de encabezado */}
          <View style={styles.tableRow} fixed>
            <View style={{ ...styles.tableColHeader, width: columnWidths.ayn }}>
              <Text style={styles.tableCellHeader}>Apellido y Nombre</Text>
            </View>
            <View
              style={{
                ...styles.tableColHeader,
                width: columnWidths.nacimiento,
              }}
            >
              <Text style={styles.tableCellHeader}>Nacimiento</Text>
            </View>
            <View
              style={{
                ...styles.tableColHeader,
                width: columnWidths.institucion,
              }}
            >
              <Text style={styles.tableCellHeader}>Institución</Text>
            </View>
            {(serie.prueba.tipo === "SaltosHorizontales" ||
              serie.prueba.tipo === "PistaConAndarivel" ||
              serie.prueba.tipo === "PistaSinAndarivel") && (
              <View
                style={{
                  ...styles.tableColHeader,
                  width: columnWidths.and,
                  alignItems: "center",
                }}
              >
                <Text style={styles.tableCellHeader}>
                  {serie.prueba.tipo === "SaltosHorizontales"
                    ? "Viento"
                    : "And"}
                </Text>
              </View>
            )}
            <View
              style={{ ...styles.tableColHeader, width: columnWidths.marca }}
            >
              <Text style={styles.tableCellHeader}>Marca</Text>
            </View>
            <View
              style={{
                ...styles.tableColHeader,
                borderRightWidth: 0,
                width: columnWidths.puesto,
              }}
            >
              <Text style={styles.tableCellHeader}>Puesto</Text>
            </View>
          </View>
          {/* Filas dinámicas */}
          {rows.map((row, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={{ ...styles.tableCol, width: columnWidths.ayn }}>
                <Text style={styles.tableCell}>{row.ayn}</Text>
              </View>
              <View
                style={{
                  ...styles.tableCol,
                  width: columnWidths.nacimiento,
                  alignItems: "center",
                }}
              >
                <Text style={styles.tableCell}>
                  {format(new Date(row.fechaDeNacimiento), "dd/MM/yyyy")}
                </Text>
              </View>
              <View
                style={{ ...styles.tableCol, width: columnWidths.institucion }}
              >
                <Text style={styles.tableCell}>{row.institucion}</Text>
              </View>
              {(serie.prueba.tipo === "PistaConAndarivel" ||
                serie.prueba.tipo === "PistaSinAndarivel" ||
                serie.prueba.tipo === "SaltosHorizontales") && (
                <View
                  style={{
                    ...styles.tableCol,
                    width: columnWidths.and,
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.tableCell}>
                    {serie.prueba.tipo === "SaltosHorizontales"
                      ? row.viento
                      : row.and}
                  </Text>
                </View>
              )}
              <View
                style={{
                  ...styles.tableCol,
                  width: columnWidths.marca,
                  alignItems: "center",
                }}
              >
                <Text style={styles.tableCell}>{row.marca}</Text>
              </View>
              <View
                style={{
                  ...styles.tableCol,
                  borderRightWidth: 0,
                  width: columnWidths.puesto,
                  alignItems: "center",
                }}
              >
                <Text style={styles.tableCell}>{row.puesto}</Text>
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
