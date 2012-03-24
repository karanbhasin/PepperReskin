using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Pepper.Helpers;
using Pepper.ViewModels.Fund;
using Pepper.ViewModels.Common;
using Pepper.Repositories;

namespace Pepper.Controllers
{
    public interface IFundRepository {
        List<FundIndexModel> GetAllFunds();
        FundViewModel GetFund(int fundId);
        List<InvestorFundViewModel> GetInvestors(int fundId);
        List<DeepBlue.Models.Entity.CapitalCall> GetCapitalCalls(int fundId, out DeepBlue.Models.CapitalCall.DetailModel detail);
        List<DeepBlue.Models.Entity.CapitalDistribution> GetCapitalDistributions(int fundId, out DeepBlue.Models.CapitalCall.DetailModel detail);
        List<DeepBlue.Models.Deal.DealReportModel> GetDeals(int fundId);
    }

    public class DeepBlueFundRepository : IFundRepository {
        public DeepBlueFundRepository() {
        }

        private ISessionRepository _sessionRepository = new SessionRepository();
        public DeepBlueFundRepository(ISessionRepository sessionRepository) {
            this._sessionRepository = sessionRepository;
        }

        public ISessionRepository SessionRepository {
            get {
                return _sessionRepository;
            }
            set {
                _sessionRepository = value;
            }
        }

        public List<FundIndexModel> GetAllFunds() {
            return DBApi.GetAllFunds(SessionRepository.DeepBlueCookies);
        }

        public FundViewModel GetFund(int fundId) {
            return DBApi.GetFund(fundId, SessionRepository.DeepBlueCookies);
        }

        public List<InvestorFundViewModel> GetInvestors(int fundId) {
            return DBApi.GetInvestors(fundId, SessionRepository.DeepBlueCookies);
        }

        public List<DeepBlue.Models.Entity.CapitalCall> GetCapitalCalls(int fundId, out DeepBlue.Models.CapitalCall.DetailModel detail) {
            return DBApi.GetCapitalCalls(fundId, SessionRepository.DeepBlueCookies, out detail);
        }

        public List<DeepBlue.Models.Entity.CapitalDistribution> GetCapitalDistributions(int fundId, out DeepBlue.Models.CapitalCall.DetailModel detail) {
            return DBApi.GetCapitaDistributions(fundId, SessionRepository.DeepBlueCookies, out detail);
        }

        public List<DeepBlue.Models.Deal.DealReportModel> GetDeals(int fundId) {
            return DBApi.GetDeals(fundId, SessionRepository.DeepBlueCookies);
        }
    }

    public class FundController : Controller
    {
        private IFundRepository _repository = new DeepBlueFundRepository();
        public IFundRepository Repository { get { return _repository; } set { _repository = value; } }

        //
        // GET: /Fund/
        [HttpGet]
        public ActionResult Index() {
            return View(this.Repository.GetAllFunds());
        }

        [HttpGet]
        public ActionResult Show(int id) {
            FundViewModel model = this.Repository.GetFund(id);
            model.Investors = this.Repository.GetInvestors(id);
            // Prep up the graph data
            DeepBlue.Models.CapitalCall.DetailModel detail = null;
            model.CapitalCalls = this.Repository.GetCapitalCalls(id, out detail);
            model.CapitalDistributions = this.Repository.GetCapitalDistributions(id, out detail);
            model.Deals = this.Repository.GetDeals(id);
            return View(model);
        }

        [HttpGet]
        public ActionResult Investors(int id) {
            return PartialView("_investors", this.Repository.GetInvestors(id));
        }

        [HttpGet]
        public ActionResult New() {
            return View();
        }

        [HttpGet]
        public ActionResult Edit() {
            return View();
        }
    }
}
