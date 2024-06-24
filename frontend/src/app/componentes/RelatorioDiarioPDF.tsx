"use client"
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { logoBase64 } from '../assets/base64Logo';
import { IAtividadeRd } from '../interfaces/IAtividadeRd';
import { IRelatorioDiario } from '../interfaces/IRelatorioDiario';
import { IImagemAtividadeRd } from '../interfaces/IImagemAtividadeRd';
import { getAllImagensInAtividade } from '../services/ImagensAtividadeRd.Service';
import Atividade from './Atividade';
import { getImageDimensions } from '../services/Images.Services';
import { getAllAtivdadesInRd } from '../services/AtvidadeRd.Service';

interface RelatorioDiarioPDFProps {
  relatorioDiario: IRelatorioDiario;
}
const RelatorioDiarioPDF: React.FC<RelatorioDiarioPDFProps> = ({ relatorioDiario }) => {

  const [key, setKey] = useState(Date.now());
  const [imagensRd, setImagensRd] = useState<IImagemAtividadeRd[]>([])
  const [atividades, setAtividades] = useState<IAtividadeRd[]>([])

  useEffect(() => {
    setKey(Date.now());

    const getImages = async () => {
      await getAllImagesFromAtividades()
    }

    getImages()

  }, []);

  const getAllImagesFromAtividades = async () => {
    const atividades = await getAllAtivdadesInRd(relatorioDiario.id)
    
    for (let atividade of atividades) {
      const res = await getAllImagensInAtividade(atividade.id)
      atividade.imagensAtividades = res
    }

    setAtividades(atividades)
  }

  const [buffer, setBuffer] = useState<any>(null);

  useEffect(() => {
    const buffer = "/src/app/assets/logo preta.jpg";
    const base64 = Buffer.from(buffer).toString("base64");
    setBuffer(base64);
  }, [atividades])

  return (
    <Document key={key}>
      <Page size="A4" style={styles.body} wrap>

          <View style={{ display: "flex", width: "100%", flexDirection: "row", justifyContent: "space-between"}}>
            <Image style={{ width: "120px", height: "60px", marginLeft: 10, marginTop: 20 }} src={logoBase64} />
            <View style={{ display: "flex", flexDirection: "column", width: "50%", marginRight: 25, marginLeft: 10, marginTop: 10, }}>
              <Text style={{ fontWeight: "bold", fontSize: 10, marginTop: 5 }}>Master Elétrica Comércio e Serviço LTDA</Text>
              <Text style={{ fontWeight: "bold", fontSize: 10, marginTop: 5 }}>35.051.479/0001-70</Text>
              <Text style={{ fontWeight: "bold", fontSize: 10, marginTop: 5 }}>Avenida Das Industrias,375</Text>
              <Text style={{ fontWeight: "bold", fontSize: 10, marginTop: 5 }}>Santa Luzia - Minas Gerais</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginRight: 10,width:"50%" }}>
              <Text style={{ fontWeight: "bold", fontSize: 10, marginTop: 5, alignSelf: "center" }}> RELATÓRIO DIÁRIO Nº {relatorioDiario.id} </Text>
              <Text style={{ fontWeight: "bold", fontSize: 10, marginTop: 5 }}> Data de Abertura {dayjs(relatorioDiario.horarioAbertura).format("DD/MM/YYYY [as] HH:mm:ss").toString()}</Text>
            </View>
          </View>
          <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",width:"90%",marginLeft:"10px",marginTop:"10px"}}>
            <Text style={{ fontWeight: "bold", fontSize: 10, marginTop: 5 }}>Cliente {relatorioDiario.contato}</Text>
            <Text style={{ fontWeight: "bold", fontSize: 10, marginTop: 5 }}>CNPJ:345634565356</Text>
          </View>
          <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",width:"90%",marginLeft:"10px",marginTop:"6px"}}>
            <Text style={{ fontWeight: "bold", fontSize: 10, marginTop: 5 }}>Endereço:Rua Jaime Carlos Afonso Teixeira,Alto Bela Vista</Text>
            <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",gap:2}}>
              <Text style={{ fontWeight: "bold", fontSize: 10, marginTop: 5 }}>Contato:Hilas</Text>
              <Text style={{ fontWeight: "bold", fontSize: 10, marginTop: 5 }}>Telefone:9987727256</Text>
            </View>
          </View>
          <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",width:"90%",marginLeft:"10px",marginTop:"6px"}}>

            <Text style={{ fontWeight: "bold", fontSize: 10, marginTop: 5 }}>Atendente:Gabriel</Text>
            
          </View>
          <View style={{ marginTop: 10, border: "solid", borderTop: "1px", width: "100%" }}>
          </View>
          <View style={{ width: "100%" }}>
            {atividades.map((atividade: IAtividadeRd, index: number) => (
              <>
                <View key={atividade.id} style={{ width: "100%", borderStyle: "solid", alignSelf: "center",marginTop:"25px" }} >
                  <Text style={styles.textTitleAtividade} break={(index + 1) % 4 === 0}>{atividade.numeroAtividade} - {atividade.descricao} - {atividade.status}</Text>
                  <View style={styles.imageContainer}>
                    { atividade.imagensAtividades && atividade.imagensAtividades.map((imagem: IImagemAtividadeRd, imgIndex: number) => (
                      <Image
                        key={imagem.id}
                        style={[
                          styles.image,
                          atividade.imagensAtividades.length % 2 !== 0 && imgIndex === atividade.imagensAtividades.length - 1
                          ? styles.centeredImage
                          : {}
                        ]}
                        src={imagem.urlImagem}
                      />
                    ))}
                  </View>
                  <Text style={styles.text}>{atividade.observacoes}</Text>
                </View>
              </>
            ))}
          </View>
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
            `${pageNumber} / ${totalPages}`
          )} fixed />
      </Page>
    </Document>
  )
}

const styles = StyleSheet.create({
  body: {
    paddingTop: 5,
    paddingBottom: 65,
    paddingHorizontal: 25,

  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: 'justify',
    fontFamily: 'Times-Roman'
  },
  textTitleAtividade: {
    margin: 12,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: 'justify',
    fontFamily: 'Times-Roman'
  },
  imageContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  image: {
    width: "48%",
    height: 195,
    marginBottom: 10,
  },
  centeredImage: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
});

export default RelatorioDiarioPDF;