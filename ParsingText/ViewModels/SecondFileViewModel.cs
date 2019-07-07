using Microsoft.AspNetCore.Http;

namespace ParsingText.ViewModels
{
    public class SecondFileViewModel
    {
        public IFormFile File { get; set; }
        
        public string TextFromMainWords { get; set; }

        public bool IsUnique { get; set; }
    }
}