using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Pepper.Helpers.Attributes;
using Pepper.ViewModels.Common;

namespace Pepper.ViewModels.Fund {
    public class InvestorFundViewModel {
        public string InvestorName { get; set; }
        public decimal CommittedAmount { get; set; }
        public decimal UnfundedAmount { get; set; }
        public DateTime? ClosedDate { get; set; }
    }
}