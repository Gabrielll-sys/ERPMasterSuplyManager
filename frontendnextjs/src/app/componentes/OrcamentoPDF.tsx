import React, { useEffect, useState } from 'react';
import { Page, Text, View, Document, StyleSheet,Image } from '@react-pdf/renderer';
import { IInventario } from '../interfaces/IInventarios';
import dayjs from 'dayjs';
import { table } from 'console';
import { useSession } from 'next-auth/react';
import { logoBase64 } from '../assets/base64Logo';



const OrcamentoPDF = (props:any)=>{

  const [buffer, setBuffer] = useState<any>(null);

useEffect(()=>{
  const buffer = "/src/app/assets/logo preta.jpg";
  // Converte o buffer em uma string base64
  const base64 = Buffer.from(buffer).toString("base64");
  // Atualiza o estado com a string base64
  setBuffer(base64);


calcPrecoVenda()
},[props])

  const[precoVendaTotalOrcamento,setPrecoVendaTotalOrcamento] = useState<number>();


  let date = dayjs()



  const calcPrecoVenda = () =>{

    let custoTotal:number | undefined = 0

    for(let item of props.materiaisOrcamento){
      
        custoTotal+=item.material.precoVenda*item.quantidadeMaterial
    

    }
    setPrecoVendaTotalOrcamento(Number(custoTotal.toFixed(2)))

    console.log(custoTotal)
  }


return(

    <Document>
    <Page size="A4">
    <View style={{display:"flex",width:"850px",flexDirection:"row",justifyContent:"space-between",marginTop:20}}>
  <Image  style ={{width:"100px",marginLeft:30,marginTop:20}}src={logoBase64}/>
           
        <View  style={{display:"flex",flexDirection:"column",width:"50%",marginRight:50}}>
        
         <Text style={{fontWeight:"bold",fontSize:11,marginTop:5}}>Master Elétrica Comércio e Serviço LTDA</Text>
         <Text style={{fontWeight:"bold",fontSize:11,marginTop:5}}>35.051.479/0001-70</Text>
         <Text style={{fontWeight:"bold",fontSize:11,marginTop:5}}>Avenida Das Industrias,375</Text>
         <Text style={{fontWeight:"bold",fontSize:11,marginTop:5}}>Santa Luzia - Minas Gerais</Text>
        
        </View>

    </View>
        

    <Text style={{textAlign:"center",marginTop:50}}>{props.nomeOrçamento}</Text>

      <View style={styles.table}> 

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
          <View style={{  width: "5%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}> 
          {props.materiaisOrcamento.map((x:IInventario)=>(

            <Text style={styles.tableCell}>{x.material.id}</Text> 
          ))}
          </View> 
          
          <View style={{  width:"55%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0,textAlign:"center"}}>
          {props.materiaisOrcamento.map((x:IInventario)=>(

            <Text style={styles.tableCell}>{x.material.descricao}</Text> 
          ))}
          </View>

          <View style={{  width: "9%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}> 
          {props.materiaisOrcamento.map((x:IInventario)=>(

            <Text style={styles.tableCell}>{x.quantidadeMaterial} {x.material.unidade}</Text> 

            ))}
          </View> 

          <View style={{  width: "10%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center",}}> 
          {props.materiaisOrcamento.map((x:IInventario)=>(

            <Text style={styles.tableCell}>{x.material.precoVenda!=null?"R$"+ x.material.precoVenda.toFixed(2).toString().replace('.',','):""}</Text> 

            ))}
          </View> 

          <View style={{  width: "11%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}> 
          {props.materiaisOrcamento.map((x:IInventario)=>(

            <Text style={styles.tableCell}>{x.material.precoVenda!=null?"R$"+ (x.material.precoVenda* x.quantidadeMaterial).toFixed(2).toString().replace('.',','):""}</Text> 

            ))}
          </View> 
         
          


        </View> 

        <View style={styles.tableRow}>

          <View style={{display:"flex",flexDirection:"row",  width: "90%",height:"40px" ,justifyContent:"space-between", borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,borderBottomWidth:1}}> 

          <Text style={{  marginTop:12, fontSize: 11,marginLeft:10}}> Quantidade de Itens:{props.materiaisOrcamento.length}</Text> 
           <Text style={{  marginTop:12, fontSize: 11,marginRight:10,}}> Preço Total Orçamento:R${precoVendaTotalOrcamento?.toFixed(2).toString().replace('.',',')}</Text> 

          </View> 



        </View>


      </View>

    
      <View style={styles.table}> 

        <View style={{  margin: "auto", flexDirection: "row" ,backgroundColor:"#EBE2AB"}}> 

          <View style={{  width: "30%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}> 
            <Text style={styles.tableCell}>Data Orçamento</Text> 
          </View> 

          <View style={{  width: "30%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}> 
            <Text style={styles.tableCell}>Total dos Itens</Text> 
          </View> 

          <View style={{  width: "30%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}> 
            <Text style={styles.tableCell}>Total Do Orçamento</Text> 
          </View> 

        </View> 

        <View style={styles.tableRow}> 
          <View style={{  width: "30%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}> 
       

            <Text style={styles.tableCell}>{"Data Orçamento:"+" "+dayjs(date).format("DD/MM/YYYY").toString()}</Text> 
         
          </View> 
          
          <View style={{  width: "30%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}> 
       

            <Text style={styles.tableCell}>R${precoVendaTotalOrcamento?.toFixed(2).toString().replace('.',',')}</Text> 
         
          </View> 
          
          <View style={{  width: "30%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}> 
       

            <Text style={styles.tableCell}>R${precoVendaTotalOrcamento?.toFixed(2).toString().replace('.',',')}</Text> 
         
          </View> 
          
        
         
          


        </View> 

      


      </View>

      <View style={{ display:"flex",flexDirection:"column",marginTop:20,marginLeft:30}}>

        <Text style={{fontSize:13,padding:5}}>Atenciosamente</Text>
        <Text style={{fontSize:13,padding:5}}>{props.nomeUsuario}</Text>

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
      marginTop:20,

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
      marginTop:2, 
      fontSize: 10,
      padding:4
    }
  });
  export default OrcamentoPDF;