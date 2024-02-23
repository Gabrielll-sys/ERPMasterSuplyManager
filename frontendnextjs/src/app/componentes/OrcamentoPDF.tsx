import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { IInventario } from '../interfaces/IInventarios';



const OrcamentoPDF = (props:any)=>{

return(

    <Document>
    <Page size="A4" >
    <View style={{display:"flex",width:"850px",flexDirection:"row",justifyContent:"space-between",marginTop:20}}>

            <Text style={{fontSize:8,alignSelf:"center",marginLeft:5}}>
            Master Elétrica MG
            </Text>
        <View  style={{display:"flex",flexDirection:"column",width:"50%",marginRight:10}}>
        
         <Text style={{fontWeight:"bold",fontSize:10,marginTop:5}}>Master Elétrica Comércio e Serviço LTDA</Text>
         <Text style={{fontWeight:"bold",fontSize:10,marginTop:5}}>35.051.479/0001-70</Text>
         <Text style={{fontWeight:"bold",fontSize:10,marginTop:5}}>Avenida Das Industrias,375</Text>
         <Text style={{fontWeight:"bold",fontSize:10,marginTop:5}}>Santa Luzia - Minas Gerais</Text>
        
        </View>

    </View>
        

    <Text style={{textAlign:"center",marginTop:50}}>dddddddddddddddddddd</Text>

      <View style={styles.table}> 

        <View style={{  margin: "auto", flexDirection: "row" ,backgroundColor:"#EBE2AB"}}> 

          <View style={{  width: "4%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0}}> 
            <Text style={styles.tableCell}>Id</Text> 
          </View> 

          <View style={{  width:"35%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0}}>
            <Text style={styles.tableCell}>Descricao</Text> 
          </View> 

          <View style={{  width:"6%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0}}> 
            <Text style={styles.tableCell}>Qntd</Text> 
          </View> 

          <View style={{  width: "10%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0}}> 
            <Text style={styles.tableCell}>Preço UN</Text> 
          </View> 


          <View style={{  width: "10%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0}}> 
            <Text style={styles.tableCell}>Total</Text> 
          </View> 
          
        </View> 

        <View style={styles.tableRow}> 
          <View style={{  width: "4%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0}}> 
          {props.materiaisOrcamento.map((x:IInventario)=>(

            <Text style={styles.tableCell}>{x.material.id}</Text> 
          ))}
          </View> 
          <View style={{  width:"35%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0}}>
          {props.materiaisOrcamento.map((x:IInventario)=>(

            <Text style={styles.tableCell}>{x.material.descricao}</Text> 
          ))}
          </View> 
          <View style={{  width: "6%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0}}> 
          {props.materiaisOrcamento.map((x:IInventario)=>(

            <Text style={styles.tableCell}>{x.quantidadeMaterial.toFixed(2)}</Text> 

            ))}
          </View> 
          <View style={{  width: "10%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0}}> 
          {props.materiaisOrcamento.map((x:IInventario)=>(

            <Text style={styles.tableCell}>{x.material.precoVenda!=null?"R$"+ x.material.precoVenda.toFixed(2).toString().replace('.',','):""}</Text> 

            ))}
          </View> 
          <View style={{  width: "10%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0}}> 
          {props.materiaisOrcamento.map((x:IInventario)=>(

            <Text style={styles.tableCell}>{x.material.precoVenda!=null?"R$"+ (x.material.precoVenda* x.quantidadeMaterial).toFixed(2).toString().replace('.',','):""}</Text> 

            ))}
          </View> 
         
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
      borderWidth: 1, 
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
    marginLeft:3,
      marginTop:2, 
      fontSize: 10 
    }
  });
  export default OrcamentoPDF;