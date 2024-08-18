"use client"
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { logoBase64 } from '../assets/base64Logo';
import { IAtividadeRd } from '../interfaces/IAtividadeRd';
import { IImagemAtividadeRd } from '../interfaces/IImagemAtividadeRd';
import { IRelatorioDiario } from '../interfaces/IRelatorioDiario';
import { getAllAtivdadesInRd } from '../services/AtvidadeRd.Service';
import { getAllImagensInAtividade } from '../services/ImagensAtividadeRd.Service';

interface RelatorioDiarioPDFProps {
  relatorioDiario: IRelatorioDiario;
  atividadesRd:IAtividadeRd[]
}
const RelatorioDiarioPDF: React.FC<RelatorioDiarioPDFProps> = ({ relatorioDiario,atividadesRd }) => {

  const [key, setKey] = useState(Date.now());
  const dataAtual = new Date()
  const [atividades, setAtividades] = useState<IAtividadeRd[]>([])
  const semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
  useEffect(() => {
    setKey(Date.now());

    const getImages = async () => {
      await getAllImagesFromAtividades()
    }

    getImages()

  }, []);

  useEffect(() => {


    const getImages = async () => {
      await getAllImagesFromAtividades()
    }

    getImages()

  }, [atividadesRd]);
 
  const getAllImagesFromAtividades = async () => {
    
    const atividades = await getAllAtivdadesInRd(relatorioDiario.id)
    
    for (let atividade of atividades) {
      const res = await getAllImagensInAtividade(atividade.id)
      atividade.imagensAtividades = res
    }

    setAtividades(atividades)
  }
  const toUpperFirstLetter = (obs:string | undefined)=> {
    if( obs !=undefined){
      const firstLetter =  obs == undefined?"":obs?.trim()[0].toUpperCase()
      return firstLetter + obs.substring(1,obs.length-1)
    }
      

  }


  useEffect(() => {
    const buffer = "/src/app/assets/logo preta.jpg";
    const base64 = Buffer.from(buffer).toString("base64");
  
  }, [atividades])

  return (
    <Document key={key}>
      <Page size="A4" style={styles.body} >

          <View style={{ display: "flex", width: "100%", flexDirection: "row", justifyContent: "space-between"}}>
            <Image style={{ width: "150px", height: "60px", marginLeft: 10, marginTop: 20 }} src={logoBase64} />
            <View style={{ display: "flex", flexDirection: "column", width: "50%", marginRight: 25, marginLeft: 10, marginTop: 10, }}>
              <Text style={{ fontWeight: "bold", fontSize: 10, marginTop: 5 }}>Master Elétrica Comércio e Serviço LTDA</Text>
              <Text style={{ fontWeight: "bold", fontSize: 10, marginTop: 5 }}>35.051.479/0001-70</Text>
              <Text style={{ fontWeight: "bold", fontSize: 10, marginTop: 5 }}>Avenida Das Industrias,375</Text>
              <Text style={{ fontWeight: "bold", fontSize: 10, marginTop: 5 }}>Santa Luzia - Minas Gerais</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginRight: 10,width:"50%" }}>
              <Text style={{ fontWeight: "bold", fontSize: 10, marginTop: 5, alignSelf: "center" }}> RELATÓRIO DIÁRIO Nº {relatorioDiario.id} </Text>
              <Text style={{ fontWeight: "bold", fontSize: 10, marginTop: 5 }}> Data de Abertura {dayjs(relatorioDiario.horarioAbertura).format("DD/MM/YYYY [as] HH:mm:ss").toString()}</Text>
              <Text style={{ fontWeight: "bold", fontSize: 10, marginTop: 5 }}>{semana[dayjs(relatorioDiario.horarioAbertura).day()]}</Text>
            </View>
          </View>
          <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",width:"90%",marginLeft:"10px",marginTop:"10px"}}>

            <Text style={{ fontWeight: "bold", fontSize: 10, marginTop: 5,lineHeight:1.5 }}>CLIENTE: {relatorioDiario.empresa} | CNPJ: {relatorioDiario.cnpj} | Endereço:{relatorioDiario.endereco}  </Text>
    
          </View>
          <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",width:"90%",marginLeft:"10px",marginTop:"6px"}}>
            <Text style={{ fontWeight: "bold", fontSize: 10, marginTop: 2 }}>CONTATO:{relatorioDiario.contato} | TELEFONE:{relatorioDiario.telefone}</Text>
            
        
          </View>
          <View style={{display:"flex",flexDirection:"row",width:"100%",marginLeft:"10px",marginTop:"6px"}}>

            <Text style={{ fontWeight: "bold", fontSize: 10, marginTop: 5 }}>ATENDENTE: {relatorioDiario.responsavelAbertura}</Text>
            {relatorioDiario.isFinished ? (
            <Text style={{ fontWeight: "bold", fontSize: 10, marginTop: 2,marginLeft:90,fontStyle:"italic"} }>Relatório Finalizado</Text>

            ):(
              <Text style={{ fontWeight: "bold", fontSize: 10, marginTop: 2,marginLeft:90,fontStyle: "italic"} }>Relatório Finalizado</Text>

            )}
           
          </View>
          <View style={{ marginTop: 10, border: "solid", borderTop: "1px", width: "97%",alignSelf:"center" }}>
          </View>
          <View style={{ width: "100%" }}>
            {atividades.map((atividade: IAtividadeRd, index: number) => (
              <>
                <View wrap={false} key={atividade.id} style={{ width: "100%", borderStyle: "solid", alignSelf: "center", }} >
                  <Text style={styles.textTitleAtividade} break={(index + 1) % 4 === 0}>{atividade.numeroAtividade} - {atividade.descricao?.toUpperCase()} - {atividade.status}</Text>
                    
                    <Text style={styles.text}>{atividade?.observacoes}</Text>
                  
                </View>
      
                <View style={{ marginTop: 10, border: "solid", borderTop: "2px", width: "97%",alignSelf:"center" }}>
                </View>
              
              </>
            ))}
          </View>
      
          
            {   atividades.map((atividade: IAtividadeRd, index: number) => (
              <>
              { atividade.imagensAtividades!= undefined && atividade.imagensAtividades?.length>0 && (

                <View wrap={false} key={atividade.id} style={{ width: "100%",  borderStyle: "solid", alignSelf: "center",display:"flex",flexDirection:"column" }}  >
                    <Text style={styles.textTitleAtividade}>{atividade.numeroAtividade} - {atividade.descricao?.toUpperCase()} - {atividade.status}</Text>
                  <View  style={styles.imageContainer}>
                    { atividade.imagensAtividades && atividade.imagensAtividades.map((imagem: IImagemAtividadeRd, imgIndex: number) => (
                      <>

                   
                        <Image
                          key={imagem.id}
                          
                          style={[
                            styles.image,
                           atividade.imagensAtividades!=undefined &&  atividade.imagensAtividades.length % 2 !== 0 && imgIndex === atividade.imagensAtividades.length - 1
                            ? styles.centeredImage
                            : {}
                          ]}
                          src={imagem.urlImagem}
                        />
                     
                    </>
                    ))}
                  </View>
                
                </View>
              )}
             
              
              </>
            ))}
       

          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
            `${pageNumber} / ${totalPages}`
          )} fixed />
      </Page>
    </Document>
  )
}

const styles = StyleSheet.create({
  body: {
    paddingTop: 6,
    paddingBottom: 65,
    paddingHorizontal: 25,

  },
  text: {
    margin: 12,
    fontSize: 12,
    textAlign: 'justify',
    lineHeight:1.5,
    fontStyle:'italic',
    
  },
  textTitleAtividade: {
    margin: 12,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: 'justify',
    fontFamily: 'Times-Roman'
  },
  imageContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    marginBottom: 1,
  },
  image: {
    width: "48%",
    height: 290,
    marginBottom: 10,
    borderRadius:"3px"

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
