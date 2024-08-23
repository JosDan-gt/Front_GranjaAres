import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Line } from 'react-chartjs-2';
import { renderToString } from 'react-dom/server';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  section: {
    marginBottom: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eaeaea',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCol: {
    width: '33%',
    padding: 5,
    borderBottomWidth: 1,
    borderColor: '#eaeaea',
  },
  tableCell: {
    fontSize: 10,
  },
});

// Documento PDF para Producción
const ProductionPDFDocument = ({ productionData, productionChart }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Producción</Text>
        <View style={styles.table}>
          <Text>{renderToString(<Line data={productionChart} options={{ responsive: true }} />)}</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.tableCell]}>Fecha</Text>
            <Text style={[styles.tableCol, styles.tableCell]}>Producción</Text>
            <Text style={[styles.tableCol, styles.tableCell]}>Defectuosos</Text>
          </View>
          {productionData.map((d, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCol, styles.tableCell]}>{d.fechaRegistro}</Text>
              <Text style={[styles.tableCol, styles.tableCell]}>{d.produccion}</Text>
              <Text style={[styles.tableCol, styles.tableCell]}>{d.defectuosos}</Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

// Documento PDF para Clasificación
const ClassificationPDFDocument = ({ classificationData, classificationChart }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Clasificación</Text>
        <View style={styles.table}>
          <Text>{renderToString(<Line data={classificationChart} options={{ responsive: true }} />)}</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.tableCell]}>Fecha</Text>
            <Text style={[styles.tableCol, styles.tableCell]}>Total Unitaria</Text>
          </View>
          {classificationData.map((d, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCol, styles.tableCell]}>{d.fechaRegistro}</Text>
              <Text style={[styles.tableCol, styles.tableCell]}>{d.totalUnitaria}</Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

// Documento PDF para Estado del Lote
const EstadoLotePDFDocument = ({ estadoLoteData, estadoLoteChart }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Estado del Lote</Text>
        <View style={styles.table}>
          <Text>{renderToString(<Line data={estadoLoteChart} options={{ responsive: true }} />)}</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.tableCell]}>Fecha</Text>
            <Text style={[styles.tableCol, styles.tableCell]}>Cantidad Gallinas</Text>
            <Text style={[styles.tableCol, styles.tableCell]}>Bajas</Text>
          </View>
          {estadoLoteData.map((d, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCol, styles.tableCell]}>{d.fechaRegistro}</Text>
              <Text style={[styles.tableCol, styles.tableCell]}>{d.cantidadG}</Text>
              <Text style={[styles.tableCol, styles.tableCell]}>{d.bajas}</Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

// Documento PDF combinado para todas las secciones
const CombinedPDFDocument = ({ productionData, classificationData, estadoLoteData, productionChart, classificationChart, estadoLoteChart }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Producción</Text>
        <View style={styles.table}>
          <Text>{renderToString(<Line data={productionChart} options={{ responsive: true }} />)}</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.tableCell]}>Fecha</Text>
            <Text style={[styles.tableCol, styles.tableCell]}>Producción</Text>
            <Text style={[styles.tableCol, styles.tableCell]}>Defectuosos</Text>
          </View>
          {productionData.map((d, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCol, styles.tableCell]}>{d.fechaRegistro}</Text>
              <Text style={[styles.tableCol, styles.tableCell]}>{d.produccion}</Text>
              <Text style={[styles.tableCol, styles.tableCell]}>{d.defectuosos}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Clasificación</Text>
        <View style={styles.table}>
          <Text>{renderToString(<Line data={classificationChart} options={{ responsive: true }} />)}</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.tableCell]}>Fecha</Text>
            <Text style={[styles.tableCol, styles.tableCell]}>Total Unitaria</Text>
          </View>
          {classificationData.map((d, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCol, styles.tableCell]}>{d.fechaRegistro}</Text>
              <Text style={[styles.tableCol, styles.tableCell]}>{d.totalUnitaria}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Estado del Lote</Text>
        <View style={styles.table}>
          <Text>{renderToString(<Line data={estadoLoteChart} options={{ responsive: true }} />)}</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.tableCell]}>Fecha</Text>
            <Text style={[styles.tableCol, styles.tableCell]}>Cantidad Gallinas</Text>
            <Text style={[styles.tableCol, styles.tableCell]}>Bajas</Text>
          </View>
          {estadoLoteData.map((d, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCol, styles.tableCell]}>{d.fechaRegistro}</Text>
              <Text style={[styles.tableCol, styles.tableCell]}>{d.cantidadG}</Text>
              <Text style={[styles.tableCol, styles.tableCell]}>{d.bajas}</Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

const PDFGenerator = ({ productionData, classificationData, estadoLoteData, productionChart, classificationChart, estadoLoteChart }) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Botón para PDF de Producción */}
      <PDFDownloadLink
        document={<ProductionPDFDocument productionData={productionData} productionChart={productionChart} />}
        fileName="produccion.pdf"
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
      >
        {({ loading }) => (loading ? 'Generando PDF...' : 'Descargar PDF de Producción')}
      </PDFDownloadLink>

      {/* Botón para PDF de Clasificación */}
      <PDFDownloadLink
        document={<ClassificationPDFDocument classificationData={classificationData} classificationChart={classificationChart} />}
        fileName="clasificacion.pdf"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
      >
        {({ loading }) => (loading ? 'Generando PDF...' : 'Descargar PDF de Clasificación')}
      </PDFDownloadLink>

      {/* Botón para PDF de Estado del Lote */}
      <PDFDownloadLink
        document={<EstadoLotePDFDocument estadoLoteData={estadoLoteData} estadoLoteChart={estadoLoteChart} />}
        fileName="estado_lote.pdf"
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
      >
        {({ loading }) => (loading ? 'Generando PDF...' : 'Descargar PDF de Estado del Lote')}
      </PDFDownloadLink>

      {/* Botón para PDF Combinado */}
      <PDFDownloadLink
        document={
          <CombinedPDFDocument
            productionData={productionData}
            classificationData={classificationData}
            estadoLoteData={estadoLoteData}
            productionChart={productionChart}
            classificationChart={classificationChart}
            estadoLoteChart={estadoLoteChart}
          />
        }
        fileName="reporte_completo.pdf"
        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200"
      >
        {({ loading }) => (loading ? 'Generando PDF...' : 'Descargar PDF Completo')}
      </PDFDownloadLink>
    </div>
  );
};

export default PDFGenerator;
