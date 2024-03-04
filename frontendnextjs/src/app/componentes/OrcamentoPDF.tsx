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

    console.log(props.materiaisOrcamento)
    console.log(props.orcamento?.id)

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

    console.log(custoTotal)
  }

  console.log(props.orcamento?.observacoes)

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
    <div style={{marginLeft:25,marginTop:20}}>
      { props.orcamento?.nomeCliente!=null && props.orcamento?.nomeCliente.length &&(

      <Text style={{fontWeight:"bold",fontSize:11,marginTop:5}}>Nome:{props.orcamento?.nomeCliente}</Text>
      )}
        { props.orcamento?.empresa!=null &&props.orcamento?.empresa.length &&(
  
          <Text style={{fontWeight:"bold",fontSize:11,marginTop:5}}>Empresa:{props.orcamento?.empresa}</Text>
        )}
        { props.orcamento?.endereco!=null &&props.orcamento?.endereco.length &&(
  
          <Text style={{fontWeight:"bold",fontSize:11,marginTop:5}}>Endereço:{props.orcamento?.endereco}</Text>
        )}
        
      { props.orcamento?.emailCliente!=null && props.orcamento?.emailCliente.length &&(

        <Text style={{fontWeight:"bold",fontSize:11,marginTop:5}}>Email:{props.orcamento?.emailCliente}</Text>

      )}
      { props.orcamento?.cpfOrCnpj!=null && props.orcamento?.cpfOrCnpj.length &&(

        <Text style={{fontWeight:"bold",fontSize:11,marginTop:5}}>CNPJ/CPF:{props.orcamento?.cpfOrCnpj}</Text>

      )}
  
    </div>

        

    <Text style={{textAlign:"center",marginTop:40}}>Orçamento Nº {props.orcamento?.id}</Text>

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
            
            <Text style={{     fontSize: 10,padding:5}}>{x.material.precoVenda!=null?"R$"+ x.material.precoVenda.toFixed(2).toString().replace('.',','):""}</Text> 

            ))}
          </View> 

          <View style={{  width: "11%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}> 
          {props.materiaisOrcamento.map((x:any)=>(

            <Text style={{  fontSize: 10,padding:5}}>{x.material.precoVenda!=null?"R$"+ (x.material.precoVenda.toFixed(2)* x.quantidadeMaterial).toFixed(2).toString().replace('.',','):""}</Text> 
              
            ))}
          </View> 
         
          


        </View> 

        <View style={styles.tableRow}>

          <View style={{display:"flex",flexDirection:"row",  width: "90%",height:"35px" ,justifyContent:"space-between", borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,borderBottomWidth:1}}> 

          <Text style={{  marginTop:12, fontSize: 11,marginLeft:10}}> Quantidade de Itens:{props.materiaisOrcamento.length}</Text> 
           <Text style={{  marginTop:12, fontSize: 11,marginRight:10,}}> Preço Total Orçamento:R${precoVendaTotalOrcamento?.toFixed(2).toString().replace('.',',')}</Text> 

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
                <Text style={styles.tableCell}>Total dos Itens</Text> 
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


                <Text style={styles.tableCell}>R${precoVendaTotalOrcamento?.toFixed(2).toString().replace('.',',')}</Text> 

              </View> 

              <View style={{  width: "30%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}> 

                <Text style={styles.tableCell}>R${precoVendaTotalOrcamento?.toFixed(2).toString().replace('.',',')}</Text> 

              </View> 


              </View> 

              </>
            )}


      


      </View>
      <Text style={{fontSize:11,marginLeft:30,marginTop:14}}>Forma de Pagamento:{props.orcamento?.tipoPagamento}</Text>

<View style={{borderColor:"black",borderWidth:"1px",width:"80%",alignSelf:"center",marginTop:20,borderRadius:"4px"}}>
<Text style={{fontSize:11,fontWeight:"extrabold",padding:9}}>*Observações</Text>

<Text style={{fontSize:11,padding:12,maxWidth:"80%"}}>{ props.orcamento?.observacoes!= null && props.orcamento?.observacoes.length?props.orcamento?.observacoes:"Sem Observações"}</Text>
</View>
      <View style={{ display:"flex",flexDirection:"column",marginTop:20,marginLeft:30}}>

        <Text style={{fontSize:11,padding:5}}>Atenciosamente,{props.nomeUsuario}</Text>
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