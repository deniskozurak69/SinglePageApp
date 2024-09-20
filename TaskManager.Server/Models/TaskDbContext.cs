using Microsoft.EntityFrameworkCore;
using TaskManager.Server.Models;
namespace TaskManager.Server.Data
{
    public class TaskDbContext : DbContext
    {
        public DbSet<TaskItem> TaskItems { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TaskItem>().ToTable("TaskItem");
        }
        public TaskDbContext(DbContextOptions<TaskDbContext> options) : base(options)
        {
        }
    }
}
