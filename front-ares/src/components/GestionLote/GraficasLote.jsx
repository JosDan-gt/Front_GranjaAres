import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';

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

// Componente de PDF para Producción
const ProductionPDFDocument = ({ productionData, productionImage }) => (
    <Document>
        <Page style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.title}>Producción</Text>
                {productionImage && <Image src={productionImage} />}
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

// Componente de PDF para Clasificación
const ClassificationPDFDocument = ({ classificationData, classificationImage }) => (
    <Document>
        <Page style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.title}>Clasificación</Text>
                {classificationImage && <Image src={classificationImage} />}
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

// Componente de PDF para Estado del Lote
const EstadoLotePDFDocument = ({ estadoLoteData, estadoLoteImage }) => (
    <Document>
        <Page style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.title}>Estado del Lote</Text>
                {estadoLoteImage && <Image src={estadoLoteImage} />}
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

// Componente de PDF combinado para todas las secciones
const CombinedPDFDocument = ({ productionData, classificationData, estadoLoteData, productionImage, classificationImage, estadoLoteImage }) => (
    <Document>
        {/* Página de Producción */}
        <Page style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.title}>Producción</Text>
                {productionImage && <Image src={productionImage} />}
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
        </Page>

        {/* Página de Clasificación */}
        <Page style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.title}>Clasificación</Text>
                {classificationImage && <Image src={classificationImage} />}
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
        </Page>

        {/* Página de Estado del Lote */}
        <Page style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.title}>Estado del Lote</Text>
                {estadoLoteImage && <Image src={estadoLoteImage} />}
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
        </Page>
    </Document>
);


const GraficasLote = ({ idLote }) => {
    const [productionData, setProductionData] = useState([]);
    const [classificationData, setClassificationData] = useState([]);
    const [estadoLoteData, setEstadoLoteData] = useState([]);
    const [productionImage, setProductionImage] = useState(null);
    const [classificationImage, setClassificationImage] = useState(null);
    const [estadoLoteImage, setEstadoLoteImage] = useState(null);
    const [period, setPeriod] = useState('diario');

    const productionChartRef = useRef(null);
    const classificationChartRef = useRef(null);
    const estadoLoteChartRef = useRef(null);

    useEffect(() => {
        if (idLote) {
            axios.get(`https://localhost:7249/api/dashboard/produccion/${idLote}/${period}`)
                .then(response => setProductionData(response.data))
                .catch(error => console.error('Error fetching production data:', error));

            axios.get(`https://localhost:7249/api/dashboard/clasificacion/${idLote}/${period}`)
                .then(response => setClassificationData(response.data))
                .catch(error => console.error('Error fetching classification data:', error));

            axios.get(`https://localhost:7249/getestadolote?idLote=${idLote}`)
                .then(response => setEstadoLoteData(response.data))
                .catch(error => console.error('Error fetching estado lote data:', error));
        }
    }, [idLote, period]);

    useEffect(() => {
        if (productionChartRef.current) {
            setProductionImage(productionChartRef.current.toBase64Image());
        }
        if (classificationChartRef.current) {
            setClassificationImage(classificationChartRef.current.toBase64Image());
        }
        if (estadoLoteChartRef.current) {
            setEstadoLoteImage(estadoLoteChartRef.current.toBase64Image());
        }
    }, [productionData, classificationData, estadoLoteData]);

    const productionChart = {
        labels: productionData.map(d => d.fechaRegistro),
        datasets: [
            {
                label: 'Producción',
                data: productionData.map(d => d.produccion),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
                tension: 0.4,
            },
            {
                label: 'Defectuosos',
                data: productionData.map(d => d.defectuosos),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false,
                tension: 0.4,
            },
        ],
    };

    const classificationChart = {
        labels: classificationData.map(d => d.fechaRegistro),
        datasets: [
            {
                label: 'Total Unitaria',
                data: classificationData.map(d => d.totalUnitaria),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                fill: false,
                tension: 0.4,
            },
        ],
    };

    const estadoLoteChart = {
        labels: estadoLoteData.map(d => d.fechaRegistro),
        datasets: [
            {
                label: 'Cantidad de Gallinas',
                data: estadoLoteData.map(d => d.cantidadG),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                fill: false,
                tension: 0.4,
            },
            {
                label: 'Bajas',
                data: estadoLoteData.map(d => d.bajas),
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                borderColor: 'rgba(255, 159, 64, 1)',
                fill: false,
                tension: 0.4,
            },
        ],
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-center space-x-2 mb-6">
                <button onClick={() => setPeriod('diario')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">Diario</button>
                <button onClick={() => setPeriod('semanal')} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200">Semanal</button>
                <button onClick={() => setPeriod('mensual')} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200">Mensual</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfica de Producción */}
                <div className="bg-white p-4 rounded-lg shadow-lg">
                    <h2 className="text-lg font-bold mb-4 text-center">Producción</h2>
                    <div className="w-full h-64">
                        <Line ref={productionChartRef} data={productionChart} options={{ maintainAspectRatio: false }} />
                    </div>
                    <div className="flex justify-center mt-4">
                        <PDFDownloadLink
                            document={<ProductionPDFDocument productionData={productionData} productionImage={productionImage} />}
                            fileName="produccion.pdf"
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
                            disabled={!productionImage}
                        >
                            {({ loading }) => (loading ? 'Generando PDF...' : 'Descargar PDF de Producción')}
                        </PDFDownloadLink>
                    </div>
                </div>

                {/* Tabla de Producción */}
                <div className="bg-white p-4 rounded-lg shadow-lg">
                    <h2 className="text-lg font-bold mb-4 text-center">Producción Detallada</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-center">Fecha</th>
                                    <th className="px-6 py-3 text-center">Producción</th>
                                    <th className="px-6 py-3 text-center">Defectuosos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productionData.map((d, index) => (
                                    <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 text-center">{d.fechaRegistro}</td>
                                        <td className="px-6 py-4 text-center">{d.produccion}</td>
                                        <td className="px-6 py-4 text-center">{d.defectuosos}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Gráfica de Clasificación */}
                <div className="bg-white p-4 rounded-lg shadow-lg">
                    <h2 className="text-lg font-bold mb-4 text-center">Clasificación</h2>
                    <div className="w-full h-64">
                        <Line ref={classificationChartRef} data={classificationChart} options={{ maintainAspectRatio: false }} />
                    </div>
                    <div className="flex justify-center mt-4">
                        <PDFDownloadLink
                            document={<ClassificationPDFDocument classificationData={classificationData} classificationImage={classificationImage} />}
                            fileName="clasificacion.pdf"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                            disabled={!classificationImage}
                        >
                            {({ loading }) => (loading ? 'Generando PDF...' : 'Descargar PDF de Clasificación')}
                        </PDFDownloadLink>
                    </div>
                </div>

                {/* Tabla de Clasificación */}
                <div className="bg-white p-4 rounded-lg shadow-lg">
                    <h2 className="text-lg font-bold mb-4 text-center">Clasificación Detallada</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-center">Fecha</th>
                                    <th className="px-6 py-3 text-center">Total Unitaria</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classificationData.map((d, index) => (
                                    <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 text-center">{d.fechaRegistro}</td>
                                        <td className="px-6 py-4 text-center">{d.totalUnitaria}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Gráfica de Estado del Lote */}
                <div className="bg-white p-4 rounded-lg shadow-lg">
                    <h2 className="text-lg font-bold mb-4 text-center">Estado del Lote</h2>
                    <div className="w-full h-64">
                        <Line ref={estadoLoteChartRef} data={estadoLoteChart} options={{ maintainAspectRatio: false }} />
                    </div>
                    <div className="flex justify-center mt-4">
                        <PDFDownloadLink
                            document={<EstadoLotePDFDocument estadoLoteData={estadoLoteData} estadoLoteImage={estadoLoteImage} />}
                            fileName="estado_lote.pdf"
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                            disabled={!estadoLoteImage}
                        >
                            {({ loading }) => (loading ? 'Generando PDF...' : 'Descargar PDF de Estado del Lote')}
                        </PDFDownloadLink>
                    </div>
                </div>

                {/* Tabla de Estado del Lote */}
                <div className="bg-white p-4 rounded-lg shadow-lg">
                    <h2 className="text-lg font-bold mb-4 text-center">Estado del Lote Detallado</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-center">Fecha</th>
                                    <th className="px-6 py-3 text-center">Cantidad Gallinas</th>
                                    <th className="px-6 py-3 text-center">Bajas</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estadoLoteData.map((d, index) => (
                                    <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 text-center">{d.fechaRegistro}</td>
                                        <td className="px-6 py-4 text-center">{d.cantidadG}</td>
                                        <td className="px-6 py-4 text-center">{d.bajas}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="flex justify-center mt-8">
                <PDFDownloadLink
                    document={
                        <CombinedPDFDocument
                            productionData={productionData}
                            classificationData={classificationData}
                            estadoLoteData={estadoLoteData}
                            productionImage={productionImage}
                            classificationImage={classificationImage}
                            estadoLoteImage={estadoLoteImage}
                        />
                    }
                    fileName="reporte_completo.pdf"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200"
                    disabled={!productionImage || !classificationImage || !estadoLoteImage}
                >
                    {({ loading }) => (loading ? 'Generando PDF...' : 'Descargar PDF Completo')}
                </PDFDownloadLink>
            </div>
        </div>
    );
};

export default GraficasLote;
