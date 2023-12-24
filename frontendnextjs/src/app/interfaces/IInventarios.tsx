export interface IInventario  {
    id: number,
    codigoInterno: string,
    codigoFabricante: string,
    categoria: string,
    descricao: string,
    marca: string,
    corrente: string,
    unidade: string,
    tensao: string,
    localizacao: string,
    dataEntradaNF: any,
    precoCusto: number,
    markup: number,
    precoVenda: number
    material:{
      id:string | number,
      categoria?: string
      codigoFabricante?: string
      codigoInterno?:number
      corrente?:string,
      dataEntradaNF? : any,
      descricao?: string,
      localizacao?: string,
      marca?: number,
      markup?: number ,
      precoCusto?: number,
      precoVenda?: number,
      tensao?: string,
      unidade?: string
      

    }


}