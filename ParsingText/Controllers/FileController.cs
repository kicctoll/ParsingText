using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ParsingText.ViewModels;

namespace ParsingText.Controllers
{
    [Route("api/parsing")]
    [Produces("application/json")]
    public class FileController : Controller
    {
        [HttpPost("upload/main-file")]
        public async Task<IActionResult> UploadMainFile([FromForm]FileViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var text = string.Empty;

            using (var stream = model.File.OpenReadStream())
            {
                using (var reader = new StreamReader(stream))
                {
                    text = await reader.ReadToEndAsync();
                }
            }
            
            // Removes dots, commas, trailing space and convert to lowercase
            var cleanTextReg = new Regex(@"[\.,]");
            text = cleanTextReg
                .Replace(text, "")
                .ToLower()
                .Trim();
            
            var splitToWordsReg = new Regex(@"\s+");
            var words = splitToWordsReg
                .Split(text)
                .OrderBy(w => w)
                .ToList();

            return Ok(new MainFileViewModel
            {
                Words = words,
                TotalNumber = words.Count,
                UniqueNumber = words.Distinct().Count()
            });
        }
    }
}