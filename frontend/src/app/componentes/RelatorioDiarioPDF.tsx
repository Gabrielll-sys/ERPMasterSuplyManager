"use client"
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { logoBase64 } from '../assets/base64Logo';
import { IAtividadeRd } from '../interfaces/IAtividadeRd';
import { IRelatorioDiario } from '../interfaces/IRelatorioDiario';

interface RelatorioDiarioPDFProps {
  atividades: IAtividadeRd[];
  relatorioDiario: IRelatorioDiario;
}
const RelatorioDiarioPDF :React.FC< RelatorioDiarioPDFProps>= ({atividades,relatorioDiario})=>{


  const [key, setKey] = useState(Date.now());

  useEffect(() => {
    // Atualiza a key quando o componente ou suas props mudam
    setKey(Date.now());
  }, [atividades]);
  const [buffer, setBuffer] = useState<any>(null);
  const mtViewSaudacoes = 12
  const mtViewObservacoes =19

useEffect(()=>{

  
  const buffer = "/src/app/assets/logo preta.jpg";
  // Converte o buffer em uma string base64
  const base64 = Buffer.from(buffer).toString("base64");
  // Atualiza o estado com a string base64
  setBuffer(base64);



},[atividades])

  const[precoVendaTotalOrcamento,setPrecoVendaTotalOrcamento] = useState<number>();


  let date = dayjs()

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

    
   

        <View style={styles.table}>

        <View style={{  width: "90%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 1,textAlign:"center",alignSelf:"center"}}>
              <Text style={{fontSize: 12,padding:2,border:"solid"}}>Relatório Diário n{relatorioDiario.id}</Text>
            </View>
          <View style={{  margin: "auto", flexDirection: "row" ,backgroundColor:"#EBE2AB"}}>
  
  
            <View style={{  width: "90%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 0,textAlign:"center"}}>
              <Text style={styles.tableCell}>Atividade</Text>
            </View>
  
        
  
          </View>


         
            {atividades.map((atividade:IAtividadeRd,index:number)=>(
                <>
   
            <View style={{  width: "90%",  borderStyle: "solid", borderWidth: 1, borderLeftWidth: 1, borderTopWidth: 1,textAlign:"left",alignSelf:"center",height:"170px"}} >
              <Text style={styles.textTitleAtividade} break={(index+1)%4==0}>{atividade.numeroAtividade} - {atividade.descricao } - {atividade.status}</Text>
              <Text style={styles.text}> {atividade.observacoes}</Text>
            </View>
            
              </>
            ))}  


            
            </View>
 
            
  
  
  
        <View style={styles.table} wrap  >
  
             <>
                    <View style={{  margin: "auto", flexDirection: "row",flexWrap:'wrap',gap:3,justifyContent:'center',alignItems:'center' }}>
  
  <Text style={styles.text}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa quibusdam voluptates, ab eligendi voluptas ex saepe? Deserunt maxime assumenda dicta cupiditate ipsa id consectetur, eum illum ut repellendus! Officia necessitatibus voluptate, optio sapiente eveniet, ratione pariatur amet at asperiores suscipit dolorem id, autem obcaecati voluptatem rerum dolore distinctio reprehenderit hic eum laboriosam molestiae assumenda. Blanditiis, beatae vero eius, incidunt quaerat optio maiores placeat eligendi laboriosam cum quibusdam architecto delectus dolorum amet ab iste nulla natus ipsum adipisci asperiores tenetur rem hic quis itaque? Nisi mollitia facilis quas reprehenderit blanditiis quam omnis distinctio velit enim quae dolor quod, commodi atque eius, doloremque, itaque optio exercitationem. Doloremque cum cumque maiores. Non magni explicabo, ipsam nostrum accusamus similique atque molestias quae aperiam vel est fugit. Officiis facilis quae eius amet perferendis, nam velit necessitatibus doloribus repellendus maiores dicta sit culpa ipsam voluptate voluptatum magni omnis similique. Voluptas quibusdam aliquid nam officiis odio quasi qui eveniet rem. Facilis dolor nobis, quasi exercitationem alias pariatur minus similique at numquam aperiam atque, odit quo molestiae ipsum ea sed eos aut quibusdam sunt eligendi voluptatibus! Commodi sapiente ullam perferendis nisi unde impedit voluptatem placeat, earum voluptatum expedita ipsa quo fugit quia quidem, tenetur, debitis maxime sit ad alias deserunt nostrum! In quod error et ad officiis totam, corporis blanditiis. Reiciendis facere nulla non dicta commodi excepturi magni labore recusandae quod quas! Provident nulla officia doloribus corporis ratione! Nam voluptates officia illo recusandae ab! Sint voluptas corporis quibusdam ipsa facilis culpa est repellat, autem maxime quaerat alias molestias architecto exercitationem iusto ipsam quo aperiam amet repellendus. Laborum recusandae adipisci, porro animi voluptate natus voluptatibus asperiores distinctio officia inventore veniam, maiores corporis, et quos reprehenderit deleniti sequi ducimus commodi culpa. Similique beatae libero quaerat cum totam veniam molestiae error ut dicta recusandae tempora numquam, consectetur possimus hic expedita ex officiis amet illo earum tenetur facere debitis assumenda quisquam nihil! Adipisci, esse eum aliquid nesciunt animi dolorem provident labore inventore corrupti totam, eaque magnam! Libero animi, esse tenetur molestiae voluptates eum illum aspernatur impedit culpa sequi eius quasi eos veritatis nostrum fugit ipsa doloribus nobis ipsam commodi accusantium recusandae vel est itaque. Illum beatae asperiores esse magnam? Possimus, iure quo distinctio quis eum ratione sequi laboriosam eveniet vitae harum labore necessitatibus minus facilis fuga in excepturi pariatur numquam. Expedita adipisci optio nulla natus quam, quas a nostrum rerum quaerat magnam similique itaque temporibus voluptatem aliquam possimus unde! Odio atque rerum quisquam facilis, hic aut minus, eveniet aliquam ducimus et ad fuga odit accusantium, perferendis corrupti molestiae quaerat asperiores labore! Alias magnam rerum voluptates totam sapiente qui repellendus assumenda ipsam, sed unde, illo perspiciatis ipsum, voluptatem impedit repellat! Laboriosam, iste molestias. Enim, assumenda ducimus itaque nihil iste nostrum minima. Velit pariatur labore culpa esse corrupti dolorem quaerat similique tenetur quos reprehenderit a voluptatem voluptates molestiae nihil, architecto atque animi dolor natus iusto alias error quae dicta? Ab nemo dolorem earum recusandae quisquam iure, non odit optio, beatae exercitationem ea! Obcaecati tempora illum laboriosam voluptatibus amet, explicabo eligendi iste, architecto aperiam assumenda tempore magni aliquid aut corrupti accusantium placeat? Harum natus quidem vero tempore cupiditate nostrum placeat qui iste temporibus minima. Perspiciatis, iusto dolorem totam, esse dolor dolore vitae culpa soluta quae consequatur deserunt? Maxime ullam unde velit optio reprehenderit dolorum quo necessitatibus. Earum deserunt non ipsa cum sint. Ipsum omnis nostrum alias nihil asperiores quasi doloremque aliquam quisquam adipisci similique accusantium sapiente, perferendis, sint sit nam nemo ipsam quas, officia quaerat aspernatur! Dignissimos sapiente, adipisci hic, recusandae excepturi quia unde quos itaque repellendus vel iusto quae laudantium ullam modi eveniet. Nobis accusamus suscipit praesentium quod pariatur optio aliquam itaque molestiae dolor eaque ut, asperiores eos odio impedit labore illum dolorum reprehenderit unde esse vitae ipsum modi voluptatem ab rerum. Quibusdam laboriosam repudiandae consequatur veniam odit culpa debitis, neque porro ipsum quod officia quia ratione, amet atque corporis minus, consectetur molestias sunt voluptas aliquid fuga voluptatem ipsam. Voluptates minima, corrupti debitis vero accusantium aut alias ab sit, iusto aliquid eveniet quam? Cumque, non fugit. Quis nulla pariatur laudantium amet. Enim, voluptate iste aperiam, possimus eum eligendi excepturi ducimus iure cupiditate voluptatem, blanditiis tempore quam incidunt beatae obcaecati deleniti minima porro. Iure reiciendis doloribus beatae, dolor animi vero, sed possimus illo esse qui natus. Tempore fugiat optio, iusto nobis esse dolorum, debitis corporis, aperiam accusamus ab possimus non. Minus hic velit aliquam. Enim, alias numquam est neque asperiores assumenda repellat quaerat harum, obcaecati dignissimos iure tenetur tempore recusandae aut voluptatibus dicta! Commodi cum quas consequatur vitae ipsum et neque placeat error. Possimus culpa tempora harum modi praesentium voluptas placeat sequi minima minus tempore doloribus repellendus enim iure voluptate expedita mollitia dicta asperiores nemo, est nam ipsum aut ducimus. Veritatis libero eum, adipisci vitae quos veniam quis corrupti repellat accusantium ex ab modi optio dolor sunt, odit vel nam incidunt eveniet distinctio labore? A necessitatibus aperiam sit in temporibus consequuntur molestias tempore nemo, dicta quis dolores eum libero est facilis earum blanditiis dolorum magni quaerat numquam maxime obcaecati culpa nulla dignissimos expedita? Vero veniam sapiente, dolor, illum, dolores maiores in totam rerum quod modi esse repellendus quis! Corrupti excepturi, eum assumenda commodi odio a, veniam explicabo repudiandae tempore delectus minus vitae reprehenderit illum cum? Cum quam ad maxime laboriosam animi! Impedit inventore voluptate nisi iste nostrum labore molestiae aliquam exercitationem ab facilis? Architecto, sequi aliquid voluptate non fugit modi ipsum, aut sunt, deleniti alias consequuntur? Placeat animi laboriosam labore iusto et similique ex vel eum adipisci incidunt facilis ullam, sapiente quae non voluptate vero voluptatibus minus ducimus? Explicabo reprehenderit quia maxime necessitatibus delectus nemo obcaecati? Praesentium quaerat incidunt obcaecati commodi molestias, officiis totam laudantium nostrum natus repudiandae quod, quo atque cupiditate consequatur possimus. Fugit vel nemo ullam ipsa eligendi itaque nostrum harum, accusamus earum ut rerum totam quo fuga numquam cupiditate aliquam? Dolorem impedit id repellat reprehenderit debitis deleniti enim esse beatae quae consectetur unde nesciunt vero eaque amet, nisi quos dolores corporis vel! Error, dolorum! Dolorem id asperiores vel magni accusamus nam itaque architecto, porro nostrum, distinctio cumque rerum maxime aliquam nesciunt inventore sit ullam, temporibus optio deserunt tenetur voluptatem sunt ipsam! Earum porro facilis, ratione eaque vero, tempora est officiis blanditiis, aperiam obcaecati explicabo? Enim ea consequuntur excepturi. Similique doloremque expedita incidunt ea dignissimos nesciunt dolor minima quam quo quaerat nemo ipsam esse accusamus, beatae deserunt delectus nisi dolores, eligendi nobis reprehenderit consequatur laboriosam alias soluta. Culpa rerum aperiam voluptates doloribus iure quaerat molestiae placeat, sint quam qui excepturi magnam nulla! Animi officia libero nihil eum cupiditate vero voluptatibus consequatur veniam. Aspernatur architecto ullam tempora. Earum repellendus labore assumenda ab nulla et nihil in explicabo consequatur, esse dolorem pariatur amet, quo aperiam facilis corrupti placeat voluptates delectus. Blanditiis doloremque perspiciatis nisi, molestiae magnam enim libero vel ex dignissimos rerum obcaecati rem. Eos repellat nihil quidem, nostrum unde impedit, iste ex cumque nulla officiis odit! Corrupti doloribus et, repellat nemo itaque ducimus assumenda, rem numquam magnam, obcaecati quis doloremque nisi ratione velit blanditiis consequatur maiores optio autem incidunt consectetur. Officia magni enim tempora suscipit rerum doloribus vitae recusandae veniam, odit cum, corporis non illum rem. Unde dolores recusandae voluptate minima inventore molestiae, ipsum dolorem impedit repellendus explicabo saepe at iure, exercitationem aut id sint deserunt numquam vitae facere. Accusantium voluptatem laudantium, labore molestiae illum ad maiores repellendus tenetur praesentium impedit sed in eius, velit ab sit fugit aut similique quod placeat natus? Velit perspiciatis nam, omnis eaque odit rerum nihil doloremque veniam voluptates! Voluptatem itaque nesciunt doloremque numquam ut, vero neque nihil eos, culpa libero ipsam suscipit temporibus quaerat ipsum accusamus. Explicabo eum, nisi sunt distinctio, magni asperiores vitae provident esse eligendi amet commodi eos officiis optio laudantium quis! Consequuntur, id! Id vitae, eum, iure, aliquid ab quos magnam doloribus nihil itaque repellendus porro. Blanditiis corporis animi reiciendis necessitatibus, accusantium repudiandae nobis quos aut earum inventore velit fuga esse modi ab vel ducimus tenetur ipsa corrupti minus fugit saepe iure temporibus dignissimos nisi? Non itaque quis ex veniam omnis minus ducimus nobis amet dolores odio possimus, incidunt excepturi velit natus. Non veniam dolorum sit quae qui, rem molestias eaque, voluptates sint, iusto accusamus illum dicta iure doloribus alias nisi voluptas tempora cupiditate autem nihil quas. Quisquam, architecto voluptatum ducimus incidunt sapiente delectus quos tempore tenetur quidem doloremque cupiditate ex sequi vero dignissimos atque ipsum natus porro fugiat error itaque veritatis maxime. Dolorem, recusandae? Qui, dignissimos, a placeat nam assumenda eveniet, quis aut adipisci hic quaerat maxime iure vero cumque minus accusamus? Sit laboriosam corrupti, odit soluta magni ratione quam dolore totam corporis ad commodi eum ab, ducimus nisi expedita eligendi aliquid laborum. Impedit ullam veniam ut? Cumque eaque minus id eos placeat officia molestias ipsam corrupti eveniet pariatur voluptatem saepe consequuntur ex eius dolorem dolore at cum, perferendis quaerat? Delectus accusantium laudantium omnis voluptatem, quo aliquid dolores iure. Rerum ab sit molestiae. Eum expedita ducimus sequi aspernatur facere sint quaerat totam magnam quae, asperiores itaque vel ad reiciendis nobis aliquam laborum magni eos a incidunt ipsa, ipsam temporibus. Odit adipisci at provident consequatur impedit, ut tempore aspernatur doloremque deserunt, illum dolores? Magni, quidem.</Text>
                    {/* <Image 
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
               <Image
                        style={styles.image}
                        src={"https://mastererpstorage.blob.core.windows.net/images/1718566487062-Captura de tela 2024-06-10 165627.png"}
        /> */}
                    </View>
                    
                  </>
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
        width:250,
        height:250
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
        margin: 12,
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