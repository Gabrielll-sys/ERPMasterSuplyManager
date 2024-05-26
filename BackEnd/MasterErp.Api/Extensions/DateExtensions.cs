using System.Runtime.Serialization;

namespace MasterErp.Api.Extensions
{
    public static class DateExtensions
    {

        public static string GetOnlyDate(this DateTime? d1) => d1.ToString().Substring(0, 10);


    }
}
