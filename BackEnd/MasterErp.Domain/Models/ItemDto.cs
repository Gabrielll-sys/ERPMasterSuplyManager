﻿using System.ComponentModel.DataAnnotations.Schema;

namespace MasterErp.Domain.Models
{
    public class ItemDto
    {

        public int MaterialId { get; set; }

        public Material? Material { get; set; }


        public int OrdemServicoId { get; set; }


        public OrdemServico? OrdemServico { get; set; }

        //Responsável pela criação do item,no caso ficara fácil rastrear quem adicionou o material na ordem de serviço
        public string ResponsavelAdicao { get; set; }
        public DateTime DataAdicaoItem { get; set; }


        public float? Quantidade { get; set; }



    }
}
