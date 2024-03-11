import React, { useEffect, useState } from 'react';
import { Page, Text, View, Document, StyleSheet,Image} from '@react-pdf/renderer';
import { IInventario } from '../interfaces/IInventarios';
import dayjs from 'dayjs';
import { table } from 'console';
import { useSession } from 'next-auth/react';
import { logoBase64 } from '../assets/base64Logo';


const OrcamentoPDF = (props:any)=>{

  const [buffer, setBuffer] = useState<any>(null);
  const mtViewSaudacoes = props.materiaisOrcamento.length>12?68:14
  const mtViewObservacoes = props.materiaisOrcamento.length>19?85:14

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
   
      if(item.material.precoVenda!=null){

        custoTotal+=item.material.precoVenda.toFixed(2)*item.quantidadeMaterial
      }
    

    }
    setPrecoVendaTotalOrcamento(Number(custoTotal))


  }


return(

    <Document>
    <Page size="A4" style={{maxHeight:"80%"}} break={props.materiaisOrcamento.lenght>12} wrap={true}>
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
      { props.orcamento?.nomeCliente!=null && props.orcamento?.nomeCliente.length &&(

      <Text style={{fontWeight:"bold",fontSize:10,marginTop:5}}>Nome:{props.orcamento?.nomeCliente}</Text>
      )}
       
        { props.orcamento?.endereco!=null &&props.orcamento?.endereco.length &&(
  
          <Text style={{fontWeight:"bold",fontSize:10,marginTop:5}}>Endereço:{props.orcamento?.endereco}</Text>
        )}
        
      { props.orcamento?.emailCliente!=null && props.orcamento?.emailCliente.length &&(

        <Text style={{fontWeight:"bold",fontSize:10,marginTop:5}}>Email:{props.orcamento?.emailCliente}</Text>

      )}
      { props.orcamento?.cpfOrCnpj!=null && props.orcamento?.cpfOrCnpj.length &&(

        <Text style={{fontWeight:"bold",fontSize:10,marginTop:5}}>CNPJ/CPF:{props.orcamento?.cpfOrCnpj}</Text>

      )}
  
      { props.orcamento?.telefone!=null && props.orcamento?.telefone.length &&(

        <Text style={{fontWeight:"bold",fontSize:10,marginTop:5}}>Telefone:{props.orcamento?.telefone}</Text>

      )}
  
    </View>

    
    <View style ={{minHeight:"350px"}}>

        <View style={styles.table}>

        <View style={{  width: "90%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 1,textAlign:"center",alignSelf:"center"}}>
              <Text style={{fontSize: 12,padding:2,border:"solid"}}>Orçamento Nº {props.orcamento?.id}</Text>
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
            {props.materiaisOrcamento.map((x:IInventario)=>(
  
              <Text key={x.id} style={{fontSize: 10,padding:3,border:"solid",borderBottom:"1px",borderRight:"1px",borderLeft:"1px"}}>{x.material.id}</Text>
            ))}
            </View>
  
            <View style={{  width:"55%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0,textAlign:"left"}}>
            {props.materiaisOrcamento.map((x:IInventario)=>(
  
              <Text key={x.id} style={{fontSize: x.material?.descricao?.length != undefined && x.material?.descricao?.length >50?8.5:10,padding:3,border:"solid",borderBottom:"1px"}}>{x.material.descricao} { x.material.descricao?.length}</Text>
            ))}
            </View>
  
            <View style={{  width: "9%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}>
            {props.materiaisOrcamento.map((x:IInventario)=>(
  
              <Text key={x.id} style={{fontSize: 10,padding:3,border:"solid",borderBottom:"1px"}}>{x.quantidadeMaterial} {x.material.unidade}</Text>
  
              ))}
            </View>
  
            <View style={{  width: "10%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center",}}>
            {props.materiaisOrcamento.map((x:IInventario)=>(
  
              <Text key={x.id} style={{fontSize: 10,padding:3,border:"solid",borderBottom:"1px"}}>{x.material.precoVenda!=null?"R$"+ x.material.precoVenda.toFixed(2).toString().replace('.',','):""}</Text>
  
              ))}
            </View>
  
            <View style={{  width: "11%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}>
            {props.materiaisOrcamento.map((x:any)=>(
  
              <Text key={x.id} style={{fontSize: 10,padding:3
                ,border:"solid",borderBottom:"1px"}}>{x.material.precoVenda!=null?"R$"+ (x.material.precoVenda.toFixed(2)* x.quantidadeMaterial).toFixed(2).toString().replace('.',','):""}</Text>
  
              ))}
            </View>
  

          </View>
  
          <View style={styles.tableRow}>
  
            <View style={{display:"flex",flexDirection:"row",  width: "90%",height:"35px" ,justifyContent:"space-between"}}>
  
            <Text style={{  marginTop:12, fontSize: 10,marginLeft:10}}> Desconto:{props.orcamento?.desconto==null || props.orcamento?.desconto ==""?"Sem descontos"
            :props.orcamento?.desconto.toFixed(2)+"%"}</Text>
             <Text style={{  marginTop:12, fontSize: 10,marginRight:10,}}> Preço Com desconto:R${props.desconto == null  || props.desconto == ""?0.00:props.desconto}</Text>
  
            </View>
  
  
  
          </View>
  
  
        </View>
  
  
        <View style={styles.table}>
  
              {props.orcamento?.isPayed ? (
                  <>
  
                    <View style={{  margin: "auto", flexDirection: "row" ,backgroundColor:"#EBE2AB"}}>
  
                    <View style={{  width: "22.5%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}>
                      <Text style={styles.tableCell}>Data Orçamento</Text>
                    </View>
  
                    <View style={{  width: "22.5%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}>
                      <Text style={styles.tableCell}>Data Venda</Text>
                    </View>
  
                    <View style={{  width: "22.5%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}>
                      <Text style={styles.tableCell}>Total dos Itens</Text>
                    </View>
  
                    <View style={{  width: "22.5%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}>
                      <Text style={styles.tableCell}>Total Do Orçamento</Text>
                    </View>
  
                    </View>
  
                    <View style={styles.tableRow}>
                    <View style={{  width: "22.5%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}>
  
                      <Text style={styles.tableCell}>{dayjs(date).format("DD/MM/YYYY").toString()}</Text>
  
                    </View>
  
                    <View style={{  width: "22.5%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}>
  
                      <Text style={styles.tableCell}>{dayjs(props.orcamento?.dataOrcamento).format("DD/MM/YYYY HH:mm:ss").toString()}</Text>
  
                    </View>
  
                    <View style={{  width: "22.5%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}>
  
  
                      <Text style={styles.tableCell}>R${precoVendaTotalOrcamento?.toFixed(2).toString().replace('.',',')}</Text>
  
                    </View>
  
                    <View style={{  width: "22.5%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}>
  
                      <Text style={styles.tableCell}>R${precoVendaTotalOrcamento?.toFixed(2).toString().replace('.',',')}</Text>
  
                    </View>
  
  
                    </View>
  
                  </>
              ):(
                <>
  
  
  
                <View style={{  margin: "auto", flexDirection: "row" ,backgroundColor:"#EBE2AB"}}>
  
                <View style={{  width: "30%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}>
                  <Text style={styles.tableCell}>Data Orçamento</Text>
                </View>
  
                <View style={{  width: "30%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}>
                  <Text style={styles.tableCell}>Quantidade de Itens</Text>
                </View>
  
                <View style={{  width: "30%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}>
                  <Text style={styles.tableCell}>Total Do Orçamento</Text>
                </View>
  
                </View>
  
                <View style={styles.tableRow}>
                <View style={{  width: "30%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}>
  
  
                  <Text style={styles.tableCell}>{dayjs(props.orcamento?.dataOrcamento).format("DD/MM/YYYY HH:mm:ss").toString()}</Text>
  
                </View>
  
                <View style={{  width: "30%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}>
  
  
                  <Text style={styles.tableCell}>{props.materiaisOrcamento.length} Itens</Text>
  
                </View>
  
                <View style={{  width: "30%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}>
  
                  <Text style={styles.tableCell}>R${precoVendaTotalOrcamento?.toFixed(2).toString().replace('.',',')}</Text>
  
                </View>
  
  
                </View>
  
                </>
              )}
        </View>
    </View>



      <View style={{ display:"flex",flexDirection:"column",alignSelf:"center",border:"solid",borderTop:"2px",width:"90%",marginTop:"50px"}}>
        <Text style={{fontSize:11,marginLeft:30,marginTop:5}}>Forma de Pagamento:{props.orcamento?.tipoPagamento}</Text>
        <View style={{borderColor:"black",borderWidth:"1px",width:"90%",alignSelf:"center",marginTop:mtViewObservacoes,borderRadius:"4px",minHeight:"70px"}}>
            <Text style={{fontSize:11,fontWeight:"extrabold",padding:9}}>*Observações</Text>
            <Text style={{fontSize:11,padding:12,maxWidth:"90%"}}>{ props.orcamento?.observacoes!= null && props.orcamento?.observacoes.length?props.orcamento?.observacoes:""}</Text>
      </View>
</View>
      <View style={{ display:"flex",flexDirection:"column",marginTop:mtViewSaudacoes,marginLeft:30,borderColor:"black",borderTop:"2px",width:"90%"}}>

        <Text style={{fontSize:11,padding:5,border:"solid",}}>Atenciosamente,{props.nomeUsuario}</Text>
        <Text style={{fontSize:11,padding:5,marginTop:6}}>Master Elétrica</Text>
        <Text style={{fontSize:11,padding:5}}>Gerando melhorias, desenvolvendo soluções!</Text>

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
    }
  });
  export default OrcamentoPDF;