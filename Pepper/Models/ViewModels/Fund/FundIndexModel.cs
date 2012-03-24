using System;
using System.Web;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Pepper.Helpers.Attributes;
using Pepper.ViewModels.Common;

namespace Pepper.ViewModels.Fund {
    public class FundIndexModel {
        public int FundId { get; set; }

        public string FundName { get; set; }

        public string TaxId { get; set; }

        public decimal? CommitmentAmount { get; set; }

        public decimal? UnfundedAmount { get; set; }

        public DateTime? InceptionDate { get; set; }

        public DateTime? ScheduleTerminationDate { get; set; }
    }
}