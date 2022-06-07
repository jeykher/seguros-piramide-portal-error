import React from 'react';
import { Page, Font, View, Document, Text, StyleSheet ,Image } from '@react-pdf/renderer';
import HeaderPDF from "./HeaderPDF"

const insuranceCompany = sessionStorage.getItem('insuranceCompany')
const colorBackground = insuranceCompany === 'OCEANICA' ? '#47C0B6' : '#CC2229';

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    paddingBottom: 20,
    paddingTop: 20
    
  },
  section: {
    margin: 10,
    padding: 10,
    display: "block",
    textAlign: "justify",
  },
  textTitle: {
    fontWeight: "bold",
    fontSize: "14",
    marginBottom: 8,
    marginTop: 8,
    padding: 7,
    color: "white",
    backgroundColor: colorBackground

  },
  textInfo: {
    fontWeight: "inherit",
    fontSize: "12",
    textAlign: "justify",
  }
});

export default function pdfDocument({errorInfo}) { 

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <HeaderPDF/>
        </View>
        <View style={styles.section}>
          <Text style={styles.textTitle}>Fecha de Error: </Text>
          <Text style={styles.textInfo}> {errorInfo.ERROR_DATE} </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.textTitle}>Error: </Text>
          <Text style={styles.textInfo}>{errorInfo.ID_ERROR_LOG} </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.textTitle}>Aplicación: </Text>
          <Text style={styles.textInfo}>{errorInfo.APPLICATION} </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.textTitle}>Mensaje de Error: </Text>
          <Text style={styles.textInfo}>{errorInfo.EXCEPTION_MESSAGE} </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.textTitle}>Parámetros de Entrada: </Text>
          <Text style={styles.textInfo}>{errorInfo.JSON_PARAMS_TRANSACTION} </Text>
        </View>
      </Page>
    </Document>
  );
}
