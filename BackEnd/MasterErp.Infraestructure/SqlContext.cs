// MasterErp.Infraestructure/Context/SqlContext.cs
using Microsoft.EntityFrameworkCore;
using MasterErp.Domain.Models;
using MasterErp.Domain.Models.Forms; // Adicionar este using
using MasterErp.Domain.Enums.Forms; // Adicionar este using

namespace MasterErp.Infraestructure.Context
{
    public class SqlContext : DbContext
    {
    
        public DbSet<Inventario> Inventarios { get; set; }
        public DbSet<Material> Materiais { get; set; }
        // ... etc ...
        public DbSet<Usuario> Usuarios { get; set; }
     
        public DbSet<Item> Itens { get; set; }
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Orcamento> Orcamentos { get; set; }
        public DbSet<ItemOrcamento> ItensOrcamento { get; set; }
        public DbSet<OrdemSeparacao> OrdemSeparacoes { get; set; }
        public DbSet<AtividadeRd> AtividadesRd { get; set; } // Já existente
        public DbSet<RelatorioDiario> RelatorioDiarios { get; set; } // Já existente

        public DbSet<ImagemAtividadeRd> ImagensAtividadeRd { get; set; } // Já existente

        public DbSet<TarefaUsuario> TarefaUsuarios { get; set; } // Já existente


       public DbSet<LogAcoesUsuario> LogAcoesUsuarios { get; set; } 

       public DbSet<SolicitacaoServico> SolicitacoesServico { get; set; } 
        public SqlContext(DbContextOptions<SqlContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); // Chame o base primeiro

      
        }
    }
}