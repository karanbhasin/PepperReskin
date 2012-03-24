using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Pepper.Repositories;

namespace Pepper.Controllers
{
    public class BaseController : Controller
    {
        private ISessionRepository _sessionRepository = new SessionRepository();
        public ISessionRepository SessionRepository {
            get {
                return _sessionRepository;
            }
            set {
                _sessionRepository = value;
            }
        }
    }
}
