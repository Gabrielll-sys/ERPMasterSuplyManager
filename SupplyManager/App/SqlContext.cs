using Microsoft.EntityFrameworkCore;
using SupplyManager.Models;

namespace SupplyManager.App
{
    public class SqlContext : DbContext
    {

        public SqlContext(DbContextOptions<SqlContext> optionsBuilder):base(optionsBuilder) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Material> Materiais { get; set; }

        public DbSet<Categoria> Categorias { get; set; }

        public DbSet<Inventario> Inventarios { get; set; }
     

    }
}
