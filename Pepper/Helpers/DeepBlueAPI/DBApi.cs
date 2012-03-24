using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net;
using System.Text;
using System.Collections.Specialized;
using System.IO;
using System.Reflection;
using System.Web.Script.Serialization;
using Pepper.ViewModels.Common;
using Pepper.ViewModels.Fund;
using DeepBlue.Helpers;

namespace Pepper.Helpers {
    public class DBApi {
        private static bool IsValid(object cell){
            return cell != null && !string.IsNullOrEmpty(cell.ToString());
        }

        public static List<FundIndexModel> GetAllFunds(CookieCollection cookies) {
            // Fund/List?pageIndex=1&pageSize=500&sortName=FundName&sortOrder=asc&fundId=0
            // {"page":1,"total":5,"rows":[{"cell":[32,"AMBERBROOK II LLC","a39c9de709ca4ffe94181ffbc","\/Date(874882800000)\/","\/Date(1093993200000)\/",19000000.0000,16663986.3074]},{"cell":[33,"AMBERBROOK III LLC","96e24fadacd84e74b420654f1","\/Date(962319600000)\/","\/Date(1183158000000)\/",75000000.0000,119014.7249]},{"cell":[34,"AMBERBROOK IV LLC","ec6d17296783426db507f3cfd","\/Date(1097708400000)\/","\/Date(1425168000000)\/",135000000.0000,-3782380.0227]},{"cell":[31,"AMBERBROOK LLC","4a3eefc4d8fd461e89b03be13","\/Date(804553200000)\/",null,5000000.0000,4979490.6098]},{"cell":[35,"AMBERBROOK V LLC","d62aa28c355e4616ab895e09d","\/Date(1204070400000)\/","\/Date(1520899200000)\/",301650000.0000,46750285.9667]}]}

            List<FundIndexModel> funds = new List<FundIndexModel>();
            // Send the request 
            string url = HttpWebRequestUtil.GetUrl("Fund/List?pageIndex=1&pageSize=500&sortName=FundName&sortOrder=asc&fundId=0");
            HttpWebResponse response = HttpWebRequestUtil.SendRequest(url, null, false, cookies, false, HttpWebRequestUtil.JsonContentType);
            if (response.StatusCode == System.Net.HttpStatusCode.OK) {
                using (Stream receiveStream = response.GetResponseStream()) {
                    // Pipes the stream to a higher level stream reader with the required encoding format. 
                    using (StreamReader readStream = new StreamReader(receiveStream, Encoding.UTF8)) {
                        string resp = readStream.ReadToEnd();
                        if (!string.IsNullOrEmpty(resp)) {
                            JavaScriptSerializer js = new JavaScriptSerializer();
                            FlexigridData flexiGrid = (FlexigridData)js.Deserialize(resp, typeof(FlexigridData));
                            foreach (FlexigridRow row in flexiGrid.rows) {
                                //{"cell":[32,"AMBERBROOK II LLC","a39c9de709ca4ffe94181ffbc","\/Date(874882800000)\/","\/Date(1093993200000)\/",19000000.0000,16663986.3074]}
                                FundIndexModel fund = new FundIndexModel();
                                fund.FundId = Convert.ToInt32(row.cell[0]);
                                fund.FundName = Convert.ToString(row.cell[1]);
                                if (IsValid(row.cell[2])) {
                                    fund.TaxId = Convert.ToString(row.cell[2]);
                                }
                                if (IsValid(row.cell[3])) {
                                    fund.InceptionDate = Convert.ToDateTime(row.cell[3]);
                                }

                                if (IsValid(row.cell[4])) {
                                    fund.ScheduleTerminationDate = Convert.ToDateTime(row.cell[4]);
                                }

                                if (IsValid(row.cell[5])) {
                                    fund.CommitmentAmount = Convert.ToDecimal(row.cell[5]);
                                }

                                if (IsValid(row.cell[6])) {
                                    fund.UnfundedAmount = Convert.ToDecimal(row.cell[6]);
                                }


                                funds.Add(fund);
                            }
                            return funds;
                        }
                    }
                }
            }
            return funds;
        }

        public static FundViewModel GetFund(int fundId, CookieCollection cookies) {
            // /Fund/FindFund/32
            //{"FundId":32,"FundName":"AMBERBROOK II LLC","TaxId":"a39c9de709ca4ffe94181ffbc","InceptionDate":"\/Date(874882800000)\/","ScheduleTerminationDate":"\/Date(1093993200000)\/","FinalTerminationDate":null,"NumofAutoExtensions":null,"DateClawbackTriggered":null,"RecycleProvision":null,"MgmtFeesCatchUpDate":null,"Carry":null,"BankDetail":[{"AccountId":24,"BankName":null,"Account":null,"AccountNumber":null,"AccountOf":null,"Reference":null,"Attention":null,"Swift":null,"FFC":null,"FFCNumber":null,"IBAN":null,"AccountPhone":null,"ABANumber":null,"AccountFax":null,"ByOrderOf":null}],"CustomField":{"Key":0,"Fields":[],"Values":[],"InitializeDatePicker":true,"IsDisplayTwoColumn":true,"IsDisplayMode":false},"FundRateSchedules":[{"FundRateScheduleId":0,"FundId":32,"InvestorTypeId":1,"RateScheduleId":0,"RateScheduleTypeId":0,"FundRateScheduleTiers":[{"Notes":null,"ManagementFeeRateScheduleId":0,"ManagementFeeRateScheduleTierId":0,"StartDate":null,"EndDate":null,"Rate":null,"FlatFee":null,"MultiplierTypeId":0},{"Notes":null,"ManagementFeeRateScheduleId":0,"ManagementFeeRateScheduleTierId":0,"StartDate":null,"EndDate":null,"Rate":null,"FlatFee":null,"MultiplierTypeId":0},{"Notes":null,"ManagementFeeRateScheduleId":0,"ManagementFeeRateScheduleTierId":0,"StartDate":null,"EndDate":null,"Rate":null,"FlatFee":null,"MultiplierTypeId":0},{"Notes":null,"ManagementFeeRateScheduleId":0,"ManagementFeeRateScheduleTierId":0,"StartDate":null,"EndDate":null,"Rate":null,"FlatFee":null,"MultiplierTypeId":0},{"Notes":null,"ManagementFeeRateScheduleId":0,"ManagementFeeRateScheduleTierId":0,"StartDate":null,"EndDate":null,"Rate":null,"FlatFee":null,"MultiplierTypeId":0},{"Notes":null,"ManagementFeeRateScheduleId":0,"ManagementFeeRateScheduleTierId":0,"StartDate":null,"EndDate":null,"Rate":null,"FlatFee":null,"MultiplierTypeId":0},{"Notes":null,"ManagementFeeRateScheduleId":0,"ManagementFeeRateScheduleTierId":0,"StartDate":null,"EndDate":null,"Rate":null,"FlatFee":null,"MultiplierTypeId":0},{"Notes":null,"ManagementFeeRateScheduleId":0,"ManagementFeeRateScheduleTierId":0,"StartDate":null,"EndDate":null,"Rate":null,"FlatFee":null,"MultiplierTypeId":0}]}],"MultiplierTypes":null,"InvestorTypes":null}

           // Send the request 
            string url = HttpWebRequestUtil.GetUrl("Fund/FindFund/" + fundId);
            HttpWebResponse response = HttpWebRequestUtil.SendRequest(url, null, false, cookies, false, HttpWebRequestUtil.JsonContentType);
            if (response.StatusCode == System.Net.HttpStatusCode.OK) {
                using (Stream receiveStream = response.GetResponseStream()) {
                    // Pipes the stream to a higher level stream reader with the required encoding format. 
                    using (StreamReader readStream = new StreamReader(receiveStream, Encoding.UTF8)) {
                        string resp = readStream.ReadToEnd();
                        if (!string.IsNullOrEmpty(resp)) {
                            JavaScriptSerializer js = new JavaScriptSerializer();
                            DeepBlue.Models.Fund.CreateModel fundDetail = (DeepBlue.Models.Fund.CreateModel)js.Deserialize(resp, typeof(DeepBlue.Models.Fund.CreateModel));
                            if (fundDetail != null) {
                                return CopyValues<FundViewModel, DeepBlue.Models.Fund.CreateModel>(fundDetail);
                            }
                        }
                    }
                }
            }
            return null;
        }

        public static List<DeepBlue.Models.Entity.CapitalCall> GetCapitalCalls(int fundId, CookieCollection cookies, out DeepBlue.Models.CapitalCall.DetailModel detail) {
            //CapitalCall/FindDetail?_1331928900146&fundId=35
            //{"FundId":35,"FundName":"AMBERBROOK V LLC","DetailType":0,"CapitalCommitted":301650000.0000,"CapitalCalled":156202114.0000,"UnfundedAmount":133836285.9749,"ManagementFees":11611600.0000,"FundExpenses":0.0000,"CapitalCalls":[{"CapitalCallId":534,"Number":"9","InvestorName":null,"CapitalCallAmount":21000000.0000,"ManagementFees":2288000.0000,"FundExpenses":0.0000,"CapitalCallDate":"\/Date(1316473200000)\/","CapitalCallDueDate":"\/Date(1317250800000)\/"},{"CapitalCallId":533,"Number":"8","InvestorName":null,"CapitalCallAmount":6500000.0000,"ManagementFees":1144000.0000,"FundExpenses":0.0000,"CapitalCallDate":"\/Date(1308265200000)\/","CapitalCallDueDate":"\/Date(1309215600000)\/"},{"CapitalCallId":532,"Number":"7","InvestorName":null,"CapitalCallAmount":12500000.0000,"ManagementFees":1144000.0000,"FundExpenses":0.0000,"CapitalCallDate":"\/Date(1300233600000)\/","CapitalCallDueDate":"\/Date(1301266800000)\/"},{"CapitalCallId":531,"Number":"6","InvestorName":null,"CapitalCallAmount":14000000.0000,"ManagementFees":0.0000,"FundExpenses":0.0000,"CapitalCallDate":"\/Date(1284505200000)\/","CapitalCallDueDate":"\/Date(1285282800000)\/"},{"CapitalCallId":529,"Number":"5","InvestorName":null,"CapitalCallAmount":16800000.0000,"ManagementFees":2288000.0000,"FundExpenses":0.0000,"CapitalCallDate":"\/Date(1261353600000)\/","CapitalCallDueDate":"\/Date(1262649600000)\/"},{"CapitalCallId":528,"Number":"4","InvestorName":null,"CapitalCallAmount":14000000.0000,"ManagementFees":1144000.0000,"FundExpenses":0.0000,"CapitalCallDate":"\/Date(1252969200000)\/","CapitalCallDueDate":"\/Date(1253746800000)\/"},{"CapitalCallId":527,"Number":"3","InvestorName":null,"CapitalCallAmount":10000000.0000,"ManagementFees":1716000.0000,"FundExpenses":0.0000,"CapitalCallDate":"\/Date(1235606400000)\/","CapitalCallDueDate":"\/Date(1236556800000)\/"},{"CapitalCallId":526,"Number":"2","InvestorName":null,"CapitalCallAmount":22277529.0000,"ManagementFees":858000.0000,"FundExpenses":0.0000,"CapitalCallDate":"\/Date(1221519600000)\/","CapitalCallDueDate":"\/Date(1222383600000)\/"},{"CapitalCallId":525,"Number":"1","InvestorName":null,"CapitalCallAmount":39124585.0000,"ManagementFees":1029600.0000,"FundExpenses":0.0000,"CapitalCallDate":"\/Date(1205452800000)\/","CapitalCallDueDate":"\/Date(1206403200000)\/"}],"CapitalDistributed":97481007.5500,"ReturnManagementFees":1430119.3200,"ReturnFundExpenses":0.0000,"ProfitsReturned":4399915.1300,"CapitalDistributions":[{"CapitalDistrubutionId":883,"Number":"14","InvestorName":null,"CapitalDistributed":13834373.8100,"ReturnManagementFees":729898.0000,"ReturnFundExpenses":0.0000,"CapitalDistributionDate":"\/Date(1325116800000)\/","CapitalDistributionDueDate":"\/Date(1325116800000)\/","Profit":0.0000,"ProfitReturn":487619.3300,"LPProfit":0.0000,"CostReturn":12616856.4800},{"CapitalDistrubutionId":880,"Number":"13","InvestorName":null,"CapitalDistributed":12638186.7000,"ReturnManagementFees":323017.4300,"ReturnFundExpenses":0.0000,"CapitalDistributionDate":"\/Date(1317337200000)\/","CapitalDistributionDueDate":"\/Date(1317337200000)\/","Profit":0.0000,"ProfitReturn":253262.3700,"LPProfit":0.0000,"CostReturn":12061906.9000},{"CapitalDistrubutionId":879,"Number":"12","InvestorName":null,"CapitalDistributed":22104927.5900,"ReturnManagementFees":38080.0000,"ReturnFundExpenses":0.0000,"CapitalDistributionDate":"\/Date(1309388400000)\/","CapitalDistributionDueDate":"\/Date(1309388400000)\/","Profit":0.0000,"ProfitReturn":1194686.0000,"LPProfit":0.0000,"CostReturn":20872161.5900},{"CapitalDistrubutionId":876,"Number":"11","InvestorName":null,"CapitalDistributed":2002648.4800,"ReturnManagementFees":3324.6500,"ReturnFundExpenses":0.0000,"CapitalDistributionDate":"\/Date(1301526000000)\/","CapitalDistributionDueDate":"\/Date(1301526000000)\/","Profit":0.0000,"ProfitReturn":19600.7800,"LPProfit":0.0000,"CostReturn":1979723.0500},{"CapitalDistrubutionId":875,"Number":"10","InvestorName":null,"CapitalDistributed":6632577.0700,"ReturnManagementFees":10351.8500,"ReturnFundExpenses":0.0000,"CapitalDistributionDate":"\/Date(1298851200000)\/","CapitalDistributionDueDate":"\/Date(1298851200000)\/","Profit":0.0000,"ProfitReturn":614289.0000,"LPProfit":0.0000,"CostReturn":6007936.2200},{"CapitalDistrubutionId":874,"Number":"9","InvestorName":null,"CapitalDistributed":5598737.1600,"ReturnManagementFees":10644.0000,"ReturnFundExpenses":0.0000,"CapitalDistributionDate":"\/Date(1296432000000)\/","CapitalDistributionDueDate":"\/Date(1296432000000)\/","Profit":0.0000,"ProfitReturn":494691.8400,"LPProfit":0.0000,"CostReturn":5093401.3200},{"CapitalDistrubutionId":872,"Number":"8","InvestorName":null,"CapitalDistributed":10168886.9700,"ReturnManagementFees":73173.9100,"ReturnFundExpenses":0.0000,"CapitalDistributionDate":"\/Date(1293667200000)\/","CapitalDistributionDueDate":"\/Date(1293667200000)\/","Profit":0.0000,"ProfitReturn":462775.2200,"LPProfit":0.0000,"CostReturn":9632937.8400},{"CapitalDistrubutionId":870,"Number":"7","InvestorName":null,"CapitalDistributed":7113576.7800,"ReturnManagementFees":71845.1500,"ReturnFundExpenses":0.0000,"CapitalDistributionDate":"\/Date(1285801200000)\/","CapitalDistributionDueDate":"\/Date(1285801200000)\/","Profit":0.0000,"ProfitReturn":532760.4000,"LPProfit":0.0000,"CostReturn":6508971.2300},{"CapitalDistrubutionId":869,"Number":"6","InvestorName":null,"CapitalDistributed":4637236.4200,"ReturnManagementFees":20840.0400,"ReturnFundExpenses":0.0000,"CapitalDistributionDate":"\/Date(1277852400000)\/","CapitalDistributionDueDate":"\/Date(1277852400000)\/","Profit":0.0000,"ProfitReturn":46186.1000,"LPProfit":0.0000,"CostReturn":4570210.2800},{"CapitalDistrubutionId":867,"Number":"5","InvestorName":null,"CapitalDistributed":4966792.3300,"ReturnManagementFees":148944.2900,"ReturnFundExpenses":0.0000,"CapitalDistributionDate":"\/Date(1269903600000)\/","CapitalDistributionDueDate":"\/Date(1269903600000)\/","Profit":0.0000,"ProfitReturn":294044.0900,"LPProfit":0.0000,"CostReturn":4523803.9500},{"CapitalDistrubutionId":864,"Number":"4","InvestorName":null,"CapitalDistributed":4861065.0200,"ReturnManagementFees":0.0000,"ReturnFundExpenses":0.0000,"CapitalDistributionDate":"\/Date(1262131200000)\/","CapitalDistributionDueDate":"\/Date(1262131200000)\/","Profit":0.0000,"ProfitReturn":0.0000,"LPProfit":0.0000,"CostReturn":4861065.0200},{"CapitalDistrubutionId":861,"Number":"3","InvestorName":null,"CapitalDistributed":647399.1000,"ReturnManagementFees":0.0000,"ReturnFundExpenses":0.0000,"CapitalDistributionDate":"\/Date(1246316400000)\/","CapitalDistributionDueDate":"\/Date(1246316400000)\/","Profit":0.0000,"ProfitReturn":0.0000,"LPProfit":0.0000,"CostReturn":647399.1000},{"CapitalDistrubutionId":859,"Number":"2","InvestorName":null,"CapitalDistributed":943142.8100,"ReturnManagementFees":0.0000,"ReturnFundExpenses":0.0000,"CapitalDistributionDate":"\/Date(1238454000000)\/","CapitalDistributionDueDate":"\/Date(1238454000000)\/","Profit":0.0000,"ProfitReturn":0.0000,"LPProfit":0.0000,"CostReturn":943142.8100},{"CapitalDistrubutionId":856,"Number":"1","InvestorName":null,"CapitalDistributed":1331457.3100,"ReturnManagementFees":0.0000,"ReturnFundExpenses":0.0000,"CapitalDistributionDate":"\/Date(1230595200000)\/","CapitalDistributionDueDate":"\/Date(1230595200000)\/","Profit":0.0000,"ProfitReturn":0.0000,"LPProfit":0.0000,"CostReturn":1331457.3100}]}
            detail = null;
            List<DeepBlue.Models.Entity.CapitalCall> capitalCalls = new List<DeepBlue.Models.Entity.CapitalCall>();
            // Send the request 
            string url = HttpWebRequestUtil.GetUrl("CapitalCall/FindDetail?fundId=" + fundId);
            HttpWebResponse response = HttpWebRequestUtil.SendRequest(url, null, false, cookies, false, HttpWebRequestUtil.JsonContentType);
            if (response.StatusCode == System.Net.HttpStatusCode.OK) {
                using (Stream receiveStream = response.GetResponseStream()) {
                    // Pipes the stream to a higher level stream reader with the required encoding format. 
                    using (StreamReader readStream = new StreamReader(receiveStream, Encoding.UTF8)) {
                        string resp = readStream.ReadToEnd();
                        if (!string.IsNullOrEmpty(resp)) {
                            JavaScriptSerializer js = new JavaScriptSerializer();
                            detail = (DeepBlue.Models.CapitalCall.DetailModel)js.Deserialize(resp, typeof(DeepBlue.Models.CapitalCall.DetailModel));
                            if (detail != null && detail.CapitalCalls != null) {
                                foreach (DeepBlue.Models.CapitalCall.CapitalCallDetail ccDetail in detail.CapitalCalls) {
                                    DeepBlue.Models.Entity.CapitalCall cc = CopyValues<DeepBlue.Models.Entity.CapitalCall, DeepBlue.Models.CapitalCall.CapitalCallDetail>(ccDetail);
                                    if (cc != null) {
                                        // Some properties dont have the same names, so do those manually
                                        if (ccDetail.CapitalCallAmount.HasValue) {
                                            cc.CapitalAmountCalled = ccDetail.CapitalCallAmount.Value;
                                        }
                                        cc.CapitalCallNumber = ccDetail.Number;
                                        capitalCalls.Add(cc);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return capitalCalls;
        }

        public static List<DeepBlue.Models.Entity.CapitalDistribution> GetCapitaDistributions(int fundId, CookieCollection cookies, out DeepBlue.Models.CapitalCall.DetailModel detail) {
            List<DeepBlue.Models.Entity.CapitalDistribution> capitalDistributions = new List<DeepBlue.Models.Entity.CapitalDistribution>();
            detail = null;
            // Send the request 
            string url = HttpWebRequestUtil.GetUrl("CapitalCall/FindDetail?fundId=" + fundId);
            HttpWebResponse response = HttpWebRequestUtil.SendRequest(url, null, false, cookies, false, HttpWebRequestUtil.JsonContentType);
            if (response.StatusCode == System.Net.HttpStatusCode.OK) {
                using (Stream receiveStream = response.GetResponseStream()) {
                    // Pipes the stream to a higher level stream reader with the required encoding format. 
                    using (StreamReader readStream = new StreamReader(receiveStream, Encoding.UTF8)) {
                        string resp = readStream.ReadToEnd();
                        if (!string.IsNullOrEmpty(resp)) {
                            JavaScriptSerializer js = new JavaScriptSerializer();
                            detail = (DeepBlue.Models.CapitalCall.DetailModel)js.Deserialize(resp, typeof(DeepBlue.Models.CapitalCall.DetailModel));
                            if (detail != null && detail.CapitalDistributions != null) {
                                foreach (DeepBlue.Models.CapitalCall.CapitalDistributionDetail cdDetail in detail.CapitalDistributions) {
                                    DeepBlue.Models.Entity.CapitalDistribution cd = CopyValues<DeepBlue.Models.Entity.CapitalDistribution, DeepBlue.Models.CapitalCall.CapitalDistributionDetail>(cdDetail);
                                    if (cd != null) {
                                        // Some properties dont have the same names, so do those manually
                                        if (cdDetail.CapitalDistributed.HasValue) {
                                            cd.DistributionAmount = cdDetail.CapitalDistributed.Value;
                                        }
                                        cd.DistributionNumber = cdDetail.Number;
                                        cd.Profits = cdDetail.ProfitReturn;
                                        capitalDistributions.Add(cd);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return capitalDistributions;
        }

        public static List<InvestorFundViewModel> GetInvestors(int fundId, CookieCollection cookies) {
            //Fund/InvestorFundList?pageIndex=1&pageSize=25&sortName=InvestorName&sortOrder=asc&fundId=32
            //{"page":1,"total":14,"rows":[{"cell":["Alegria LLC",6000000.0000,3902811.1576,"\/Date(1331683200000)\/"]},{"cell":["Ellen M. Poss",750000.0000,487851.3943,"\/Date(1331683200000)\/"]},{"cell":["Gregory E. Rea, M.D.",1000000.0000,650468.5260,"\/Date(1331683200000)\/"]},{"cell":["Herbert W. Hirsch, SEP IRA",75000.0000,48785.1392,"\/Date(1331683200000)\/"]},{"cell":["ISLP",1000000.0000,650468.5260,"\/Date(1331683200000)\/"]},{"cell":["Jerrold M. Newman",152000.0000,98871.2160,"\/Date(1331683200000)\/"]},{"cell":["Jerrold M. Newman (m)",923000.0000,600382.4495,"\/Date(1331683200000)\/"]},{"cell":["Luisa Hunnewell",38000.0000,24717.8040,"\/Date(1331683200000)\/"]},{"cell":["M. Luisa Hunnewell & Laurence M. Newman",212000.0000,137899.3272,"\/Date(1331683200000)\/"]},{"cell":["Mitchell Kapor",750000.0000,487851.3943,"\/Date(1331683200000)\/"]},{"cell":["Nadine F. Newman",1000000.0000,650468.5260,"\/Date(1331683200000)\/"]},{"cell":["QTIP Trust u/w/o Michel Fribourg",2000000.0000,1300937.0522,"\/Date(1331683200000)\/"]},{"cell":["Sippel Farb Family Trust",100000.0000,65046.8522,"\/Date(1331683200000)\/"]},{"cell":["The Trustees of Hamilton College",5000000.0000,3252342.6312,"\/Date(1331683200000)\/"]}]}

            List<InvestorFundViewModel> investors = new List<InvestorFundViewModel>();
            // Send the request 
            string url = HttpWebRequestUtil.GetUrl("Fund/InvestorFundList?pageIndex=1&pageSize=500&sortName=InvestorName&sortOrder=asc&fundId=" + fundId);
            HttpWebResponse response = HttpWebRequestUtil.SendRequest(url, null, false, cookies, false, HttpWebRequestUtil.JsonContentType);
            if (response.StatusCode == System.Net.HttpStatusCode.OK) {
                using (Stream receiveStream = response.GetResponseStream()) {
                    // Pipes the stream to a higher level stream reader with the required encoding format. 
                    using (StreamReader readStream = new StreamReader(receiveStream, Encoding.UTF8)) {
                        string resp = readStream.ReadToEnd();
                        if (!string.IsNullOrEmpty(resp)) {
                            JavaScriptSerializer js = new JavaScriptSerializer();
                            FlexigridData flexiGrid = (FlexigridData)js.Deserialize(resp, typeof(FlexigridData));
                            foreach (FlexigridRow row in flexiGrid.rows) {
                                InvestorFundViewModel investorFund = new InvestorFundViewModel();
                                // "cell":["Alegria LLC",6000000.0000,3902811.1576,"\/Date(1331683200000)\/"]
                                investorFund.InvestorName = Convert.ToString(row.cell[0]);
                                investorFund.CommittedAmount = Convert.ToDecimal(row.cell[1]);
                                investorFund.UnfundedAmount = Convert.ToDecimal(row.cell[2]);
                                if (row.cell[3] != null) {
                                    investorFund.ClosedDate = Convert.ToDateTime(row.cell[3]);
                                }
                                investors.Add(investorFund);
                            }
                            return investors;
                        }
                    }
                }
            }
            return investors;
        }

        public static List<DeepBlue.Models.Deal.DealReportModel> GetDeals(int fundId, CookieCollection cookies) {
            //Fund/InvestorFundList?pageIndex=1&pageSize=25&sortName=InvestorName&sortOrder=asc&fundId=32
            //Deal/DealReportList?pageIndex=1&pageSize=25&sortName=&sortOrder=asc&fundId=35
            //{"page":1,"total":86,"rows":[{"cell":[842,87,"Pita","03/07/2012","$6,504,553.97","$8,625,060.17","$323,135,315.00","",""]},{"cell":[841,86,"Birndorf","03/07/2012","$1,482,941.66","$1,480,000.00","$3,330,000.00","",""]}]}

            List<DeepBlue.Models.Deal.DealReportModel> deals = new List<DeepBlue.Models.Deal.DealReportModel>();
            // Send the request 
            string url = HttpWebRequestUtil.GetUrl("Deal/DealReportList?pageIndex=1&pageSize=500&sortName=&sortOrder=asc&fundId=" + fundId);
            HttpWebResponse response = HttpWebRequestUtil.SendRequest(url, null, false, cookies, false, HttpWebRequestUtil.JsonContentType);
            if (response.StatusCode == System.Net.HttpStatusCode.OK) {
                using (Stream receiveStream = response.GetResponseStream()) {
                    // Pipes the stream to a higher level stream reader with the required encoding format. 
                    using (StreamReader readStream = new StreamReader(receiveStream, Encoding.UTF8)) {
                        string resp = readStream.ReadToEnd();
                        if (!string.IsNullOrEmpty(resp)) {
                            JavaScriptSerializer js = new JavaScriptSerializer();
                            FlexigridData flexiGrid = (FlexigridData)js.Deserialize(resp, typeof(FlexigridData));
                            foreach (FlexigridRow row in flexiGrid.rows) {
                                DeepBlue.Models.Deal.DealReportModel deal = new DeepBlue.Models.Deal.DealReportModel();
                                deal.DealId = Convert.ToInt32(row.cell[0]);
                                deal.DealNumber = Convert.ToInt32(row.cell[1]);
                                deal.DealName = Convert.ToString(row.cell[2]);
                                deal.DealDate = DateTime.Parse(row.cell[3].ToString());
                                if (!string.IsNullOrEmpty(row.cell[4].ToString())) {
                                    deal.NetPurchasePrice = Decimal.Parse(Convert.ToString(row.cell[4]), System.Globalization.NumberStyles.Currency);
                                }
                                if (!string.IsNullOrEmpty(row.cell[5].ToString())) {
                                    deal.GrossPurchasePrice = Decimal.Parse(Convert.ToString(row.cell[5]), System.Globalization.NumberStyles.Currency);
                                }
                                if (!string.IsNullOrEmpty(row.cell[6].ToString())) {
                                    deal.CommittedAmount = Decimal.Parse(Convert.ToString(row.cell[6]), System.Globalization.NumberStyles.Currency);
                                }
                                if (!string.IsNullOrEmpty(row.cell[7].ToString())) {
                                    deal.NoOfShares = Decimal.Parse(row.cell[7].ToString());
                                }
                                if (!string.IsNullOrEmpty(row.cell[8].ToString())) {
                                    deal.FMV = Decimal.Parse(Convert.ToString(row.cell[8]), System.Globalization.NumberStyles.Currency);
                                }
                                deals.Add(deal);
                            }
                            return deals;
                        }
                    }
                }
            }
            return deals;
        }

        private static T CopyValues<T, J>(J objectToCopyFrom) {
            T obj = Activator.CreateInstance<T>();
            // loop through all the properties of T and try to find   if J also has that property. If yes, then copy the values from J to T
            Type t = typeof(T);
            PropertyInfo[] properties = t.GetProperties(BindingFlags.Public|BindingFlags.Instance);
            PropertyInfo[] sourceObjProperties = typeof(J).GetProperties();
            foreach (PropertyInfo property in properties) {
                PropertyInfo targetProperty = sourceObjProperties.Where(x=>x.Name == property.Name).FirstOrDefault();
                if (targetProperty != null) {
                    try {
                        property.SetValue(obj, targetProperty.GetValue(objectToCopyFrom, null), null);
                    } catch {
                    }
                }
            }
            return obj;
        }
    }
}