﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Pepper.Helpers.Attributes;
using Pepper.ViewModels.Common;

namespace Pepper.ViewModels.Fund {
    public class FundViewModel {

        public FundViewModel() {
            FundId = 0;
        }

        public int FundId { get; set; }

        [Required(ErrorMessage = "Fund Name is required")]
        [StringLength(50, ErrorMessage = "Fund Name must be under 50 characters.")]
        [DisplayName("Fund Name")]
        public string FundName { get; set; }

        [Required(ErrorMessage = "Tax Id is required")]
        [StringLength(50, ErrorMessage = "Tax Id must be under 50 characters.")]
        [DisplayName("Tax Id")]
        public string TaxId { get; set; }

        [Required(ErrorMessage = "Fund Start Date is required")]
        [DisplayName("Fund Start Date")]
        [DateRange()]
        public DateTime? InceptionDate { get; set; }

        [DisplayName("Schedule Termination Date")]
        public DateTime? ScheduleTerminationDate { get; set; }

        [DisplayName("Final Termination Date")]
        public DateTime? FinalTerminationDate { get; set; }

        [DisplayName("Automatic Extensions")]
        public int? NumofAutoExtensions { get; set; }

        [DisplayName("Date Clawback Triggered")]
        public DateTime? DateClawbackTriggered { get; set; }

        [DisplayName("Recycle Provision %")]
        [Range(0, 100, ErrorMessage = "Recycle Provision must be under 100%.")]
        public decimal? RecycleProvision { get; set; }

        [DisplayName("Mgmt Fees Catchup Date")]
        public DateTime? MgmtFeesCatchUpDate { get; set; }

        [DisplayName("Carry %")]
        [Range(0, 100, ErrorMessage = "Carry must be under 100%.")]
        public decimal? Carry { get; set; }

        /* Bank Details */

        public IEnumerable<AccountViewModel> BankDetail { get; set; }

        public List<InvestorFundViewModel> Investors { get; set; }

        public List<DeepBlue.Models.Entity.CapitalCall> CapitalCalls { get; set; }

        public List<DeepBlue.Models.Entity.CapitalDistribution> CapitalDistributions { get; set; }

        public List<DeepBlue.Models.Deal.DealReportModel> Deals { get; set; }
        //public CustomFieldModel CustomField { get; set; }

        //public IEnumerable<FundRateScheduleDetail> FundRateSchedules { get; set; }

       //public List<SelectListItem> MultiplierTypes { get; set; }

        //public List<SelectListItem> InvestorTypes { get; set; }
    }
}