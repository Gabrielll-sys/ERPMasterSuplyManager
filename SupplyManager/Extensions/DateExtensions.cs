﻿
using System.Runtime.Serialization;

namespace SupplyManager.Extensions
{
    public static class DateExtensions
    {

        public static string GetOnlyDate(this DateTime? d1) => d1.ToString().Substring(0,10);


        }
}