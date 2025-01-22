

using Microsoft.EntityFrameworkCore;
using MasterErp.Domain.Models;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
namespace MasterErp.Infraestructure;
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
   // public DbSet<Fornecedor> Fornecedores { get; set; }
    public DbSet<ItemNotaFiscal> ItensNotaFiscal{ get; set; }
    public DbSet<Cliente> Clientes{ get; set; }
    public DbSet<ItemOrcamento> ItensOrcamento{ get; set; }
    public DbSet<Orcamento> Orcamentos{ get; set; }
    
    public DbSet<LogAcoesUsuario> LogAcoesUsuarios{ get; set; }

    public DbSet<RelatorioDiario> RelatorioDiarios{ get; set; }
    
    public DbSet<ImagemAtividadeRd> ImagensAtividadeRd { get; set; }
    public DbSet<TarefaUsuario> TarefaUsuarios { get; set; }


protected override void OnModelCreating(ModelBuilder modelBuilder)
{
        
    base.OnModelCreating(modelBuilder);
        //Linha necessária pois depois de ter migrado de mysql para sql datase,houve conversão do tipo booelan pra smallint
    modelBuilder.Entity<Usuario>()
        .Property(e => e.isActive)
        .HasConversion(new BoolToZeroOneConverter<Int16>());

        modelBuilder.Entity<RelatorioDiario>()
        .Property(e => e.isFinished)
        .HasConversion(new BoolToZeroOneConverter<Int16>());

        modelBuilder.Entity<Orcamento>()
        .Property(e => e.IsPayed)
        .HasConversion(new BoolToZeroOneConverter<Int16>());
        //converte do tipo string para o DateTime,pois após conversão do mysql para sqldatabase os tipos foram trocados
        modelBuilder.Entity<ImagemAtividadeRd>()
       .Property(e => e.DataAdicao)
       .HasConversion<string>();

    }
}
