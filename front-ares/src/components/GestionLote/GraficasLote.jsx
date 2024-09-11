import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../axiosInstance';
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

const ITEMS_PER_PAGE = 5;
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
                        <Text style={[styles.tableCol, styles.tableCell]}>Tamaño</Text>
                        <Text style={[styles.tableCol, styles.tableCell]}>Total Unitaria</Text>
                    </View>
                    {classificationData.map((d, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={[styles.tableCol, styles.tableCell]}>{d.fechaRegistro}</Text>
                            <Text style={[styles.tableCol, styles.tableCell]}>{d.tamano}</Text>
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
                    <Text style={[styles.tableCol, styles.tableCell]}>Tamaño</Text>
                    <Text style={[styles.tableCol, styles.tableCell]}>Total Unitaria</Text>
                </View>
                {classificationData.map((d, index) => (
                    <View key={index} style={styles.tableRow}>
                        <Text style={[styles.tableCol, styles.tableCell]}>{d.fechaRegistro}</Text>
                        <Text style={[styles.tableCol, styles.tableCell]}>{d.tamano}</Text>
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

    const [currentPageProd, setCurrentPageProd] = useState(1);
    const [currentPageClass, setCurrentPageClass] = useState(1);
    const [currentPageEstado, setCurrentPageEstado] = useState(1);

    const productionChartRef = useRef(null);
    const classificationChartRef = useRef(null);
    const estadoLoteChartRef = useRef(null);

    useEffect(() => {
        if (idLote) {
            axiosInstance.get(`/api/dashboard/produccion/${idLote}/${period}`)
                .then(response => setProductionData(response.data))
                .catch(error => console.error('Error fetching production data:', error));

            axiosInstance.get(`/api/dashboard/clasificacion/${idLote}/${period}`)
                .then(response => setClassificationData(response.data))
                .catch(error => console.error('Error fetching classification data:', error));

            axiosInstance.get(`/getestadolote?idLote=${idLote}`)
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
                borderColor: 'rgba(107, 142, 35, 1)', // Verde oscuro
                backgroundColor: 'rgba(107, 142, 35, 0.2)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Defectuosos',
                data: productionData.map(d => d.defectuosos),
                borderColor: 'rgba(139, 69, 19, 1)', // Marrón
                backgroundColor: 'rgba(139, 69, 19, 0.2)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const processClassificationChartData = () => {
        const labels = [...new Set(classificationData.map(d => d.fechaRegistro))];
        const tamanoGroups = ['Pigui', 'Pequeño', 'Mediano', 'Grande', 'Extra Grande'];

        const datasets = tamanoGroups.map(tamano => ({
            label: tamano,
            data: labels.map(label => {
                const data = classificationData.find(d => d.fechaRegistro === label && d.tamano === tamano);
                return data ? data.totalUnitaria : 0;
            }),
            backgroundColor: tamano === 'Pigui' ? 'rgba(139, 69, 19, 0.2)' : // Marrón
                tamano === 'Pequeño' ? 'rgba(85, 107, 47, 0.2)' : // Verde oliva
                    tamano === 'Mediano' ? 'rgba(218, 165, 32, 0.2)' : // Dorado
                        tamano === 'Grande' ? 'rgba(107, 142, 35, 0.2)' : // Verde oscuro
                            tamano === 'Extra Grande' ? 'rgba(154, 205, 50, 0.2)' : // Verde amarillento
                                'rgba(160, 82, 45, 0.2)',  // Marrón oscuro por defecto
            borderColor: tamano === 'Pigui' ? 'rgba(139, 69, 19, 1)' :
                tamano === 'Pequeño' ? 'rgba(85, 107, 47, 1)' :
                    tamano === 'Mediano' ? 'rgba(218, 165, 32, 1)' :
                        tamano === 'Grande' ? 'rgba(107, 142, 35, 1)' :
                            tamano === 'Extra Grande' ? 'rgba(154, 205, 50, 1)' :
                                'rgba(160, 82, 45, 1)',  // Marrón oscuro por defecto
            fill: true,
            tension: 0.4,
        }));

        return {
            labels,
            datasets,
        };
    };

    const classificationChart = processClassificationChartData();

    const estadoLoteChart = {
        labels: estadoLoteData.map(d => d.fechaRegistro),
        datasets: [
            {
                label: 'Cantidad de Gallinas',
                data: estadoLoteData.map(d => d.cantidadG),
                borderColor: 'rgba(107, 142, 35, 1)', // Verde oscuro
                backgroundColor: 'rgba(107, 142, 35, 0.2)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Bajas',
                data: estadoLoteData.map(d => d.bajas),
                borderColor: 'rgba(139, 69, 19, 1)', // Marrón
                backgroundColor: 'rgba(139, 69, 19, 0.2)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const handlePageClickProd = (pageNumber) => setCurrentPageProd(pageNumber);
    const handlePageClickClass = (pageNumber) => setCurrentPageClass(pageNumber);
    const handlePageClickEstado = (pageNumber) => setCurrentPageEstado(pageNumber);

    const paginatedProductionData = productionData.slice((currentPageProd - 1) * ITEMS_PER_PAGE, currentPageProd * ITEMS_PER_PAGE);
    const paginatedClassificationData = classificationData.slice((currentPageClass - 1) * ITEMS_PER_PAGE, currentPageClass * ITEMS_PER_PAGE);
    const paginatedEstadoLoteData = estadoLoteData.slice((currentPageEstado - 1) * ITEMS_PER_PAGE, currentPageEstado * ITEMS_PER_PAGE);


    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-center space-x-2 mb-6">
                <button onClick={() => setPeriod('diario')} className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition duration-200">Diario</button>
                <button onClick={() => setPeriod('semanal')} className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-200">Semanal</button>
                <button onClick={() => setPeriod('mensual')} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200">Mensual</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfica de Producción */}
                <div className="bg-white p-4 rounded-lg shadow-lg border border-yellow-300">
                    <h2 className="text-lg font-bold mb-4 text-center text-yellow-800">Producción</h2>
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
                <div className="bg-white p-4 rounded-lg shadow-lg border border-orange-300 mt-4">
                    <h2 className="text-lg font-bold mb-4 text-center text-orange-800">Producción Detallada</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-orange-100">
                                <tr>
                                    <th className="px-6 py-3 text-center">Fecha</th>
                                    <th className="px-6 py-3 text-center">Producción</th>
                                    <th className="px-6 py-3 text-center">Defectuosos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedProductionData.map((d, index) => (
                                    <tr key={index} className="bg-white border-b hover:bg-orange-50">
                                        <td className="px-6 py-4 text-center">{d.fechaRegistro}</td>
                                        <td className="px-6 py-4 text-center">{d.produccion}</td>
                                        <td className="px-6 py-4 text-center">{d.defectuosos}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={() => handlePageClickProd(currentPageProd - 1)}
                            disabled={currentPageProd === 1}
                            className="px-3 py-2 bg-yellow-700 text-white text-sm rounded-md hover:bg-yellow-800 transition duration-300 disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <span className="text-sm text-yellow-700">
                            Página {currentPageProd} de {Math.ceil(productionData.length / ITEMS_PER_PAGE)}
                        </span>
                        <button
                            onClick={() => handlePageClickProd(currentPageProd + 1)}
                            disabled={currentPageProd * ITEMS_PER_PAGE >= productionData.length}
                            className="px-3 py-2 bg-yellow-700 text-white text-sm rounded-md hover:bg-yellow-800 transition duration-300 disabled:opacity-50"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>

                {/* Gráfica de Clasificación */}
                <div className="bg-white p-4 rounded-lg shadow-lg border border-green-300">
                    <h2 className="text-lg font-bold mb-4 text-center text-green-800">Clasificación</h2>
                    <div className="w-full h-64">
                        <Line ref={classificationChartRef} data={classificationChart} options={{ maintainAspectRatio: false }} />
                    </div>
                    <div className="flex justify-center mt-4">
                        <PDFDownloadLink
                            document={<ClassificationPDFDocument classificationData={classificationData} classificationImage={classificationImage} />}
                            fileName="clasificacion.pdf"
                            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition duration-200"
                            disabled={!classificationImage}
                        >
                            {({ loading }) => (loading ? 'Generando PDF...' : 'Descargar PDF de Clasificación')}
                        </PDFDownloadLink>
                    </div>
                </div>

                {/* Tabla de Clasificación */}
                <div className="bg-white p-4 rounded-lg shadow-lg border border-red-300 mt-4">
                    <h2 className="text-lg font-bold mb-4 text-center text-red-800">Clasificación Detallada</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-red-100">
                                <tr>
                                    <th className="px-6 py-3 text-center">Fecha</th>
                                    <th className="px-6 py-3 text-center">Tamaño</th>
                                    <th className="px-6 py-3 text-center">Total Unitaria</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedClassificationData.map((d, index) => (
                                    <tr key={index} className="bg-white border-b hover:bg-red-50">
                                        <td className="px-6 py-4 text-center">{d.fechaRegistro}</td>
                                        <td className="px-6 py-4 text-center">{d.tamano}</td>
                                        <td className="px-6 py-4 text-center">{d.totalUnitaria}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={() => handlePageClickClass(currentPageClass - 1)}
                            disabled={currentPageClass === 1}
                            className="px-3 py-2 bg-green-700 text-white text-sm rounded-md hover:bg-green-800 transition duration-300 disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <span className="text-sm text-green-700">
                            Página {currentPageClass} de {Math.ceil(classificationData.length / ITEMS_PER_PAGE)}
                        </span>
                        <button
                            onClick={() => handlePageClickClass(currentPageClass + 1)}
                            disabled={currentPageClass * ITEMS_PER_PAGE >= classificationData.length}
                            className="px-3 py-2 bg-green-700 text-white text-sm rounded-md hover:bg-green-800 transition duration-300 disabled:opacity-50"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
                {/* Gráfica de Estado del Lote */}
                <div className="bg-white p-4 rounded-lg shadow-lg border border-brown-300">
                    <h2 className="text-lg font-bold mb-4 text-center text-brown-800">Estado del Lote</h2>
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
                <div className="bg-white p-4 rounded-lg shadow-lg border border-yellow-300 mt-4">
                    <h2 className="text-lg font-bold mb-4 text-center text-yellow-800">Estado del Lote Detallado</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-yellow-100">
                                <tr>
                                    <th className="px-6 py-3 text-center">Fecha</th>
                                    <th className="px-6 py-3 text-center">Cantidad Gallinas</th>
                                    <th className="px-6 py-3 text-center">Bajas</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedEstadoLoteData.map((d, index) => (
                                    <tr key={index} className="bg-white border-b hover:bg-yellow-50">
                                        <td className="px-6 py-4 text-center">{d.fechaRegistro}</td>
                                        <td className="px-6 py-4 text-center">{d.cantidadG}</td>
                                        <td className="px-6 py-4 text-center">{d.bajas}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={() => handlePageClickEstado(currentPageEstado - 1)}
                            disabled={currentPageEstado === 1}
                            className="px-3 py-2 bg-yellow-700 text-white text-sm rounded-md hover:bg-yellow-800 transition duration-300 disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <span className="text-sm text-yellow-700">
                            Página {currentPageEstado} de {Math.ceil(estadoLoteData.length / ITEMS_PER_PAGE)}
                        </span>
                        <button
                            onClick={() => handlePageClickEstado(currentPageEstado + 1)}
                            disabled={currentPageEstado * ITEMS_PER_PAGE >= estadoLoteData.length}
                            className="px-3 py-2 bg-yellow-700 text-white text-sm rounded-md hover:bg-yellow-800 transition duration-300 disabled:opacity-50"
                        >
                            Siguiente
                        </button>
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
                    className="bg-brown-600 text-white px-4 py-2 rounded-lg hover:bg-brown-700 transition duration-200"
                    disabled={!productionImage || !classificationImage || !estadoLoteImage}
                >
                    {({ loading }) => (loading ? 'Generando PDF...' : 'Descargar PDF Completo')}
                </PDFDownloadLink>
            </div>
        </div>
    );
};

export default GraficasLote;
