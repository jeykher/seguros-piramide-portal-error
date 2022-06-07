import React from 'react';
import { Text, Image, View, StyleSheet } from '@react-pdf/renderer';
import LogoPiramide from '../../assets/logo-piramides.png';
import LogoOceanica from '../../assets/Oceanica.png';
import { textAlign } from '@mui/system';

const styles2 = StyleSheet.create({
  page: {
    backgroundColor: 'white'
  },
  section: {
    margin: 10,

    display: "block",
    textAlign: "justify"
  },
  textTitle: {
    fontWeight: "bold"
  },
  containerLogo: {
    textAlign: "center",
    margin: "auto",
    height: 50,
  },
  logo: {
    textAlign: "center",
    width: 150,
    marginTop: 40,
    marginBottom: 40,
    height: 40,
    margin: "auto"
  }
});

const insuranceCompany = sessionStorage.getItem('insuranceCompany')


export default function HeaderPDF() {
  return (
      <View style={styles2.containerLogo}>
        <Image style={styles2.logo} src={insuranceCompany==="OCEANICA"?LogoOceanica:LogoPiramide} />
      </View>
  );
}
