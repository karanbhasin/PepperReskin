using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net;
using Pepper.Helpers;

namespace Pepper.Repositories {
    public interface ISessionRepository {
        CookieCollection DeepBlueCookies { get; set; }
    }

    public class SessionRepository : ISessionRepository {
        private CookieCollection deepBlueCookies = null;
        private const string dbCookiesIdent = "DeepBlueCookies";
        public CookieCollection DeepBlueCookies {
            get {
                if (deepBlueCookies == null) {
                    // Try to get it from Session
                    deepBlueCookies = Pepper.Helpers.HttpContextFactory.GetHttpContext().Session[dbCookiesIdent] as CookieCollection;
                }
                return deepBlueCookies;
            }
            set {
                deepBlueCookies = value;
                Pepper.Helpers.HttpContextFactory.GetHttpContext().Session[dbCookiesIdent] = value;
            }
        }
    }
}