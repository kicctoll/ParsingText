using System.Collections.Generic;
 
 namespace ParsingText.ViewModels
 {
     public class MainFileViewModel
     {
         public string Name { get; set; }
         
         public IEnumerable<string> Words { get; set; }
         
         public int TotalNumber { get; set; }
         
         public int UniqueNumber { get; set; }
     }
 }