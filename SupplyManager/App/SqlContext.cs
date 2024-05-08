using Microsoft.EntityFrameworkCore;
using SupplyManager.Controllers;
using SupplyManager.Models;
using LogAcoesUsuario = SupplyManager.Models.LogAcoesUsuario;

namespace SupplyManager.App
{
    public class SqlContext : DbContext
    {

        public SqlContext(DbContextOptions<SqlContext> optionsBuilder):base(optionsBuilder) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<AtividadeRd> AtividadesRd { get; set; }

        public DbSet<Material> Materiais { get; set; }
        public DbSet<Inventario> Inventarios { get; set; }

        public DbSet<OrdemServico> OrdemServicos { get; set; }
        public DbSet<Item> Itens { get; set; }
        public DbSet<NotaFiscal> NotasFiscais { get; set; }
        public DbSet<Fornecedor> Fornecedores { get; set; }
        public DbSet<ItemNotaFiscal> ItensNotaFiscal{ get; set; }
        public DbSet<Cliente> Clientes{ get; set; }
        public DbSet<ItemOrcamento> ItensOrcamento{ get; set; }
        public DbSet<Orcamento> Orcamentos{ get; set; }
        
        public DbSet<LogAcoesUsuario> LogAcoesUsuarios{ get; set; }
 
        public DbSet<RelatorioDiario> RelatorioDiarios{ get; set; }
        
        public DbSet<ImagemAtividadeRd> ImagensAtividadeRd { get; set; }

        
    }
}
