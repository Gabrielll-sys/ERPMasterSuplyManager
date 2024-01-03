export interface IInventario  {
    id: number,
    dataAlteracao:any,
    materialId:number,
    razao:string,
    estoque:number,
    movimentacao:number,
    saldoFinal?:number | undefined,
    responsavel:string,
    material:
    {
      id:string | number,
      categoria?: string
      codigoFabricante?: string
      codigoInterno?:number
      corrente?:string,
      dataEntradaNF? : any,
      descricao?: string,
      localizacao?: string,
      marca?: string,
      markup?: number ,
      precoCusto?: number,
      precoVenda?: number,
      tensao?: string,
      unidade?: string
      

    }


}