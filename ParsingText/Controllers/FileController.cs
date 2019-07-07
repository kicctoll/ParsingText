using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ParsingText.Extensions;
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
            var words = SplitToWordsAndOrderBy(cleanText).ToList();

            var uniqueWords = words.Distinct().ToList();

            return Ok(new MainFileViewModel
            {
                Name = model.File.FileName,
                Words = uniqueWords,
                TotalNumber = words.Count,
                UniqueNumber = uniqueWords.Count
            });
        }

        [HttpPost("upload/second-file")]
        public async Task<IActionResult> UploadSecondFile(SecondFileViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var textFromSecondFile = await RetrieveCleanTextFromFileAsync(model.File);
            var wordsFromMainFile =
                Regex.Split(model.TextFromMainWords, @",")
                    .ToList();

            var lineNumbersInAnotherFile =
                wordsFromMainFile.ConvertAll(_ => new {LineNumbers = new StringBuilder()});

            var lines = Regex.Split(textFromSecondFile, @"\r\n|\r|\n");

            for (int i = 0; i < lines.Length; i++)
            {
                var lineWords = SplitToWordsAndOrderBy(lines[i]).Distinct();
                foreach (var lineWord in lineWords)
                {
                    var indexes = wordsFromMainFile.FindAllIndexes(lineWord);
                    foreach (var index in indexes)
                    {
                        lineNumbersInAnotherFile[index].LineNumbers.Append(i + 1 + ", ");
                    }
                }
            }

            return Ok(new
            {
                fileName = model.File.FileName,
                lineNumbers = lineNumbersInAnotherFile.Select(l => l.LineNumbers.ToString())
            });
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
            return ConvertToCleanText(text);
        }

        private string ConvertToCleanText(string text) =>
            Regex.Replace(text, @"[\.,]", "")
                .ToLower()
                .Trim();

        private IEnumerable<string> SplitToWordsAndOrderBy(string text) =>
            Regex.Split(text, @"\s+")
                .OrderBy(w => w);
    }
}