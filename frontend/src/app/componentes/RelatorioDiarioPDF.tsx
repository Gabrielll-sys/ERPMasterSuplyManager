"use client"
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { logoBase64 } from '../assets/base64Logo';
import { IInventario } from '../interfaces/IInventarios';


const RelatorioDiarioPDF = ({atividades,relatorioDiarioId})=>{

  const [buffer, setBuffer] = useState<any>(null);
  const mtViewSaudacoes = 12
  const mtViewObservacoes =19

useEffect(()=>{

  
  const buffer = "/src/app/assets/logo preta.jpg";
  // Converte o buffer em uma string base64
  const base64 = Buffer.from(buffer).toString("base64");
  // Atualiza o estado com a string base64
  setBuffer(base64);



},[])

  const[precoVendaTotalOrcamento,setPrecoVendaTotalOrcamento] = useState<number>();


  let date = dayjs()




return(

    <Document>
    <Page size="A4" style={{maxHeight:"80%"}}  wrap={true}>
    <View style={{display:"flex",width:"450px",flexDirection:"row",justifyContent:"space-between"}}>
  <Image  style ={{width:"100px",marginLeft:30,marginTop:20}}src={logoBase64}/>
           
        <View  style={{display:"flex",flexDirection:"column",width:"50%",marginRight:50,marginTop:10,}}>
        
         <Text style={{fontWeight:"bold",fontSize:10,marginTop:5}}>Master Elétrica Comércio e Serviço LTDA</Text>
         <Text style={{fontWeight:"bold",fontSize:10,marginTop:5}}>35.051.479/0001-70</Text>
         <Text style={{fontWeight:"bold",fontSize:10,marginTop:5}}>Avenida Das Industrias,375</Text>
         <Text style={{fontWeight:"bold",fontSize:10,marginTop:5}}>Santa Luzia - Minas Gerais</Text>
        
        </View>

    </View>
    <View style={{marginLeft:30,marginTop:10,border:"solid",borderTop:"2px",width:"90%"}}>
     
  
    </View>

    
    <View style ={{minHeight:"350px"}}>

        <View style={styles.table}>

        <View style={{  width: "90%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 1,textAlign:"center",alignSelf:"center"}}>
              <Text style={{fontSize: 12,padding:2,border:"solid"}}>Relatório Diário Nº {relatorioDiarioId}</Text>
            </View>
          <View style={{  margin: "auto", flexDirection: "row" ,backgroundColor:"#EBE2AB"}}>
  
            <View style={{  width: "5%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}>
              <Text style={styles.tableCell}>Id</Text>
            </View>
  
            <View style={{  width:"55%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0,textAlign:"center"}}>
              <Text style={styles.tableCell}>Descricao</Text>
            </View>
  
            <View style={{  width:"9%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0,textAlign:"center"}}>
              <Text style={styles.tableCell}>Qntd</Text>
            </View>
  
            <View style={{  width: "10%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}>
              <Text style={styles.tableCell}>Preço UN</Text>
            </View>
  
  
            <View style={{  width: "11%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}>
              <Text style={styles.tableCell}>Total</Text>
            </View>
  
          </View>
  
          <View style={styles.tableRow}>
            <View style={{  width: "5%",textAlign:"center"}}>
           

          </View>
  
          <View style={styles.tableRow}>
  
           
            FSDFGHSDHGHSDFOUIHGUSDHUGHSDUIOH\nfjsdgjfipfjsdhfguhjsdughnuisdhguisdhgiuhh
  
          </View>
  
  
        </View>
        </View>
  
  
        <View style={styles.table}>
  
             <>
                    <View style={{  margin: "auto", flexDirection: "row",flexWrap:'wrap',gap:3,justifyContent:'center',alignItems:'center' }}>
  
  
                    <Image
                        style={styles.image}
                        src={"https://mastererpstorage.blob.core.windows.net/images/1718566487062-Captura de tela 2024-06-10 165627.png"}
        />
                   <Image
                        style={styles.image}
                        src={"https://mastererpstorage.blob.core.windows.net/images/1718566487062-Captura de tela 2024-06-10 165627.png"}
        />
                   <Image
                        style={styles.image}
                        src={"https://mastererpstorage.blob.core.windows.net/images/1718566487062-Captura de tela 2024-06-10 165627.png"}
        />
                    </View>
                    
                  </>
                  </View>
    </View>



 
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
        width:250,
        height:250
      }
  });
  export default RelatorioDiarioPDF;