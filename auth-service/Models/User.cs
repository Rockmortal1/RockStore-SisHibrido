using System;
using System.ComponentModel.DataAnnotations;

namespace auth_service.Models
{
    public class User
    {
        [Key]
        public Guid id {get; set;} = Guid.NewGuid();

        [Required]
        [EmailAddress]
        public string Email {get; set;} = string.Empty;

        [Required]
        public string PasswordHash {get; set;} = string.Empty;

        [Required]
        public string Role {get;set;} = "Client"; //Por defecto el rol sera cliente

        public DateTime CreatedAt {get; set;} = DateTime.UtcNow;

        public DateTime? DeletedAt {get; set;}
    }
}