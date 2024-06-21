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
const RelatorioDiarioPDF :React.FC< RelatorioDiarioPDFProps>= ({relatorioDiario})=>{


  const [key, setKey] = useState(Date.now());
  const[imagensRd,setImagensRd] = useState<IImagemAtividadeRd[]>([])
  const[atividades,setAtividades] = useState<IAtividadeRd[]>([])
  useEffect(() => {
    // Atualiza a key quando o componente ou suas props mudam
    setKey(Date.now());

    const getImages = async()=>{

      await getAllImagesFromAtividades()
    }


    getImages()

  }, []);

  const getAllImagesFromAtividades = async()=>{

    const atividades = await getAllAtivdadesInRd(relatorioDiario.id)

    let listOfImages:IImagemAtividadeRd[]=[] 

    
    for(let atividade of atividades){

      
      const res = await getAllImagensInAtividade(atividade.id)

      atividade.imagensAtividades = res

      atividade.imagensAtividades.map(x=>console.log(x))

    //   res.forEach((imagemAtividadeRd: IImagemAtividadeRd) => {
    //    //Busca a atividade daquela imagem
    //     const atividade = atividades.find(x=>x.id==imagemAtividadeRd.id)
    //   // Faz um push na lista de imagens da atividade
    //     atividade?.imagensAtividades.push(imagemAtividadeRd)

        
        
    //   });
     }

    setAtividades(atividades)
    
    // for(let imagem of listOfImages){
      
    //   const dimensions = await getImageDimensions(imagem.urlImagem)
    //   imagem.height = dimensions.height
    //   imagem.width = dimensions.width
    // }
    
    // setImagensRd(listOfImages)
    

  }
  const [buffer, setBuffer] = useState<any>(null);


useEffect(()=>{

  
  const buffer = "/src/app/assets/logo preta.jpg";
  // Converte o buffer em uma string base64
  const base64 = Buffer.from(buffer).toString("base64");
  // Atualiza o estado com a string base64
  setBuffer(base64);



},[atividades])

console.log(atividades)

return(

    <Document key={key} >
    <Page size="A4" style={styles.body}  wrap>
    <View style={{display:"flex",width:"450px",marginLeft:20,flexDirection:"row",justifyContent:"space-between"}}>
  <Image  style ={{width:"120px",height:"60px",marginLeft:10,marginTop:20}}src={logoBase64}/>
           
        <View  style={{display:"flex",flexDirection:"column",width:"50%",marginRight:25,marginLeft:10,marginTop:10,}}>
        
         <Text style={{fontWeight:"bold",fontSize:10,marginTop:5}}>Master Elétrica Comércio e Serviço LTDA</Text>
         <Text style={{fontWeight:"bold",fontSize:10,marginTop:5}}>35.051.479/0001-70</Text>
         <Text style={{fontWeight:"bold",fontSize:10,marginTop:5}}>Avenida Das Industrias,375</Text>
         <Text style={{fontWeight:"bold",fontSize:10,marginTop:5}}>Santa Luzia - Minas Gerais</Text>
        
        </View>

        <View style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <Text style={{fontWeight:"bold",fontSize:10,marginTop:5,alignSelf:"center" ,marginLeft:25}}> RELATÓRIO DIÁRIO Nº {relatorioDiario.id} </Text>
        <Text style={{fontWeight:"bold",fontSize:10,marginTop:5}}> Data de Abertura {dayjs(relatorioDiario.horarioAbertura).format("DD/MM/YYYY [as] HH:mm:ss").toString()}</Text>

        </View>
    </View>
    <View style={{marginLeft:30,marginTop:10,border:"solid",borderTop:"2px",width:"90%"}}>
     
  
    </View>

        <View style={{  width: "90%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 1,textAlign:"center",alignSelf:"center"}}>
              <Text style={{fontSize: 12,padding:2,border:"solid"}}>Relatório Diário n{relatorioDiario.id}</Text>
            </View>
          <View style={{  margin: "auto", flexDirection: "column" ,width:"90%"}}>
  
  
            {atividades.map((atividade:IAtividadeRd,index:number)=>(
                <>
   
            <View  key={atividade.id} style={{  width: "100%",  borderStyle: "solid",alignSelf:"center",alignItems:"center"}} >
              <Text style={styles.textTitleAtividade} break={(index+1)%4==0}>{atividade.numeroAtividade} - {atividade.descricao } - {atividade.status}</Text>

              { atividade.imagensAtividades && atividade.imagensAtividades.map((imagem:IImagemAtividadeRd)=>(

                  <>
                  
                      <Image
                          style={styles.image}
                          src={imagem.urlImagem}
                      />
                    
                        </>

                  ))}

              <Text style={styles.text}  > {atividade.observacoes}</Text>

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
    table: { 
      display: "flex", 
      width: "auto",  
      borderRightWidth: 0, 
      borderBottomWidth: 0,
      marginTop:7,

    }, 
    tableRow: { 
      margin: "auto", 
      flexDirection: "row" ,
      height:"400px"

    }, 
    tableCol: { 
      width: "30%", 
      borderStyle: "solid", 
      borderWidth: 1, 
      borderLeftWidth: 0, 
      borderTopWidth: 0
    }, 
    tableCell: {  
      fontSize: 10,
      padding:3,
      border:"solid",
      borderBottom:"1px"
    },
    image: {
      marginTop:4,
        width:650,
        height:450
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
      body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
      },
      text: {
        margin: 22,
        fontSize: 14,
        textAlign: 'justify',
        fontFamily: 'Times-Roman'

      },
      textTitleAtividade: {
        margin: 12,
        fontSize: 14,
        fontWeight:"heavy",
        textAlign: 'justify',
        fontFamily: 'Times-Roman'
      },
  });
  export default RelatorioDiarioPDF;