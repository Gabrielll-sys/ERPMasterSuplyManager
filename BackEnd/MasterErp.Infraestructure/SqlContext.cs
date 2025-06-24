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

        // NOVOS DBSETS PARA FORMULÁRIOS
        public DbSet<FormTemplate> FormTemplates { get; set; }
        public DbSet<FormTemplateSection> FormTemplateSections { get; set; }
        public DbSet<FormTemplateItem> FormTemplateItems { get; set; }
        public DbSet<FilledFormInstance> FilledFormInstances { get; set; }
        public DbSet<FilledItemResponse> FilledItemResponses { get; set; }

       public DbSet<LogAcoesUsuario> LogAcoesUsuarios { get; set; } 
        public SqlContext(DbContextOptions<SqlContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); // Chame o base primeiro

            // Configurações para suas entidades existentes (se houver)
            // ...

            // NOVAS CONFIGURAÇÕES PARA FORMULÁRIOS

            // FormTemplate
            modelBuilder.Entity<FormTemplate>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.HasOne(e => e.CreatedByUser)
                      .WithMany() // Um usuário pode criar muitos templates
                      .HasForeignKey(e => e.CreatedByUserId)
                      .OnDelete(DeleteBehavior.SetNull); // Se o usuário for deletado, não deletar o template

                entity.HasMany(e => e.Sections)
                      .WithOne(s => s.FormTemplate)
                      .HasForeignKey(s => s.FormTemplateId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(e => e.HeaderFields)
                      .WithOne(i => i.FormTemplateAsHeader)
                      .HasForeignKey(i => i.FormTemplateIdAsHeader)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // FormTemplateSection
            modelBuilder.Entity<FormTemplateSection>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.HasMany(e => e.Items)
                      .WithOne(i => i.FormTemplateSection)
                      .HasForeignKey(i => i.FormTemplateSectionId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // FormTemplateItem
            modelBuilder.Entity<FormTemplateItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Label).IsRequired().HasMaxLength(500);
                entity.Property(e => e.ItemType).IsRequired().HasConversion<string>().HasMaxLength(50); // Salvar enum como string
                entity.Property(e => e.OptionsJson).HasColumnType("json"); // Se seu BD suportar tipo JSON (MySQL sim)
            });

            // FilledFormInstance
            modelBuilder.Entity<FilledFormInstance>(entity =>
            {
                entity.HasKey(e => e.Id); // Guid
                entity.HasOne(e => e.FormTemplate)
                      .WithMany() // Um template pode ter muitas instâncias preenchidas
                      .HasForeignKey(e => e.FormTemplateId)
                      .OnDelete(DeleteBehavior.Restrict); // Não permitir deletar template se houver instâncias

                entity.HasOne(e => e.FilledByUser)
                      .WithMany() // Um usuário pode preencher muitas instâncias
                      .HasForeignKey(e => e.FilledByUserId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.Property(e => e.Status).IsRequired().HasConversion<string>().HasMaxLength(50);
                entity.Property(e => e.HeaderDataJson).IsRequired().HasColumnType("json");

                entity.HasMany(e => e.Responses)
                      .WithOne(r => r.FilledFormInstance)
                      .HasForeignKey(r => r.FilledFormInstanceId)
                      .OnDelete(DeleteBehavior.Cascade); // Se deletar a instância, deletar as respostas

                // Adicionar índice para otimizar buscas por status e usuário
                entity.HasIndex(e => new { e.FilledByUserId, e.Status });
            });

            // FilledItemResponse
            modelBuilder.Entity<FilledItemResponse>(entity =>
            {
                entity.HasKey(e => e.Id); // Guid
                entity.HasOne(e => e.FormTemplateItem)
                      .WithMany() // Um item de template pode ter muitas respostas (em diferentes formulários)
                      .HasForeignKey(e => e.FormTemplateItemId)
                      .OnDelete(DeleteBehavior.Restrict); // Não deletar item de template se houver respostas

                // Adicionar índice para otimizar buscas
                entity.HasIndex(e => e.FilledFormInstanceId);
            });
        }
    }
}