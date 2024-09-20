using System.ComponentModel.DataAnnotations;
namespace TaskManager.Server.Models
{
    public class TaskItem
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "Поле не повинно бути порожнім")]
        public string Title { get; set; }
        [Required(ErrorMessage = "Поле не повинно бути порожнім")]
        public string Description { get; set; }
        public bool IsCompleted { get; set; }
        public DateOnly Deadline { get; set; }
    }
}