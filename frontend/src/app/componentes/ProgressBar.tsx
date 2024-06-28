import { IAtividadeRd } from "../interfaces/IAtividadeRd"

interface ProgressBarProps{
    atividades:IAtividadeRd []
}


export function ProgressBar( props:ProgressBarProps){
   

  
   const progressStyle={
    width:`${props.atividades.length}%`
   }
    return(

        <div className='h-3 rounded-xl bg-zinc-700 w-full mt-4'>

        <div
        role="progressbar"
        aria-label="Progresso de hábitos completados nesse dia"
        aria-volumenow={props.atividades.length}
        className='h-3 rounded-xl bg-violet-600 transition-all'
        style={progressStyle}
        />
      </div>

    )


}