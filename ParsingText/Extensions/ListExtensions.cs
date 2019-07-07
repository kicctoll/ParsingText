using System.Collections.Generic;
using System.Linq;

namespace ParsingText.Extensions
{
    public static class ListExtensions
    {
        public static int[] FindAllIndexes<T>(this IEnumerable<T> source, T item) =>
            source.Select((o, i) => Equals(o, item) ? i : -1).Where(i => i != -1).ToArray();
    }
}