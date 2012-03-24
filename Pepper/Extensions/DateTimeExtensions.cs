using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Globalization;
using System.Threading;


namespace System {
    public static class DateTimeExtensions {
        public static string ToNeutralShortDate(this DateTime source) {
            return source.ToString("d MMM yyyy");
        }
    }
}