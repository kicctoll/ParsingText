using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ParsingText.ViewModels;

namespace ParsingText.Controllers
{
    [Route("api/parsing")]
    [Produces("application/json")]
    public class FileController : Controller
    {
        [HttpPost("upload/main-file")]
        public async Task<IActionResult> UploadMainFile([FromForm] FileViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var cleanText = await RetrieveCleanTextFromFileAsync(model.File);

            var splitToWordsReg = new Regex(@"\s+");
            var words = splitToWordsReg
                .Split(cleanText)
                .OrderBy(w => w)
                .ToList();

            return Ok(new MainFileViewModel
            {
                Name = model.File.Name,
                Words = words,
                TotalNumber = words.Count,
                UniqueNumber = words.Distinct().Count()
            });
        }

        [HttpPost("upload/second-file")]
        public async Task<IActionResult> UploadSecondFile([FromForm] SecondFileViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var textFromSecondFile = await RetrieveCleanTextFromFileAsync(model.File);

            

            return Ok(textFromSecondFile);
        }

        private async Task<string> RetrieveCleanTextFromFileAsync(IFormFile file)
        {
            var text = string.Empty;
            using (var stream = file.OpenReadStream())
            {
                using (var reader = new StreamReader(stream))
                {
                    text = await reader.ReadToEndAsync();
                }
            }

            // Removes dots, commas, trailing space and convert to lowercase
            var cleanTextReg = new Regex(@"[\.,]");
            return cleanTextReg
                .Replace(text, "")
                .ToLower()
                .Trim();
        }
    }
}