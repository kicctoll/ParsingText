using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace ParsingText.ViewModels
{
    public class FileViewModel
    {
        [Required]
        public IFormFile File { get; set; }
    }
}