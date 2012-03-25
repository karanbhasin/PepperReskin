using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Security;
using System.Net;
using Pepper.Areas.Public.ViewModels;
using Pepper.Controllers;

namespace Pepper.Areas.Public.Controllers {
    public interface IAccountRepository {
        bool ValidateUser(string username, string password, string entityCode, CookieCollection cookies);
        void SetAuthCookie(string userName, bool createPersistentCookie);
    }

    public class AccountRepository : IAccountRepository {
        public bool ValidateUser(string username, string password, string entityCode, CookieCollection cookies) {
            return Pepper.Helpers.HttpWebRequestUtil.LoginPortal(username, password, entityCode, cookies);
        }

        public void SetAuthCookie(string userName, bool createPersistentCookie) {
            FormsAuthentication.SetAuthCookie(userName, createPersistentCookie);
        }
    }

    public class AccountController : BaseController {
        private IAccountRepository _repository = new AccountRepository();
        public IAccountRepository Repository { get { return _repository; } set { _repository = value; } }

        public AccountController() {
        }

        public AccountController(IAccountRepository accountRepo) {
            this.Repository = accountRepo;
        }
        //
        // GET: /Account/LogOn
        [HttpGet]
        public ActionResult Login() {
            //If you are trying to map a default route to an MVC 3 app with areas, your global.asax file might have something like this:
            //routes.MapRoute(
            //       "Default",
            //       "{area}/{controller}/{action}/{id}",
            //       new { area = "MyArea", controller = "Home", action = "Index", id = UrlParameter.Optional }
            //);

            //If you go to your app root in the URL, you may get a runtime error like this:
            //The view 'Index' or its master was not found or no view engine supports the searched locations. The following locations were searched:
            //For some reason, the view engine does not appear to look in the area folder for the view file the same as if you type in the whole link. The strange thing is the code reaches the controller action. Here is the fix: 

            if (!this.ControllerContext.RouteData.DataTokens.ContainsKey("area")) {
                this.ControllerContext.RouteData.DataTokens.Add("area", "Public");
            }
            return View();
        }

        //
        // POST: /Account/LogOn

        [HttpPost]
        public ActionResult Login(LogOnModel model, string returnUrl) {
            if (ModelState.IsValid) {
                // Log into the Pepper site
                CookieCollection deepBlueCookies = new CookieCollection();
                if(this.Repository.ValidateUser(model.UserName, model.Password, model.EntityCode, deepBlueCookies)){
                    this.Repository.SetAuthCookie(string.Format("{0}:{1}",model.UserName, model.EntityCode), model.RememberMe);
                    // Set the cookies you got from DeepBlue in the session, as you will need those cookies when making api calls
                    this.SessionRepository.DeepBlueCookies = deepBlueCookies;
                    if (Url.IsLocalUrl(returnUrl) && returnUrl.Length > 1 && returnUrl.StartsWith("/")
                        && !returnUrl.StartsWith("//") && !returnUrl.StartsWith("/\\")) {
                        return Redirect(returnUrl);
                    } else {
                        // Specify area = "" as we currently are in the Public area and we want to go to the main app
                        return RedirectToAction("Show", "Fund", new { id = 32, area = "" });
                    }
                } else {
                     ModelState.AddModelError("", "The user name or password provided is incorrect.");
                }
                return View("Login");
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        //
        // GET: /Account/LogOff

        public ActionResult LogOff() {
            FormsAuthentication.SignOut();

            return RedirectToAction("Index", "Home");
        }

        //
        // GET: /Account/Register

        public ActionResult Register() {
            return View();
        }

        //
        // POST: /Account/Register

        [HttpPost]
        public ActionResult Register(RegisterModel model) {
            if (ModelState.IsValid) {
                // Attempt to register the user
                MembershipCreateStatus createStatus;
                Membership.CreateUser(model.UserName, model.Password, model.Email, null, null, true, null, out createStatus);

                if (createStatus == MembershipCreateStatus.Success) {
                    FormsAuthentication.SetAuthCookie(model.UserName, false /* createPersistentCookie */);
                    return RedirectToAction("Index", "Home");
                } else {
                    ModelState.AddModelError("", ErrorCodeToString(createStatus));
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        //
        // GET: /Account/ChangePassword

        [Authorize]
        public ActionResult ChangePassword() {
            return View();
        }

        //
        // POST: /Account/ChangePassword

        [Authorize]
        [HttpPost]
        public ActionResult ChangePassword(ChangePasswordModel model) {
            if (ModelState.IsValid) {

                // ChangePassword will throw an exception rather
                // than return false in certain failure scenarios.
                bool changePasswordSucceeded;
                try {
                    MembershipUser currentUser = Membership.GetUser(User.Identity.Name, true /* userIsOnline */);
                    changePasswordSucceeded = currentUser.ChangePassword(model.OldPassword, model.NewPassword);
                } catch (Exception) {
                    changePasswordSucceeded = false;
                }

                if (changePasswordSucceeded) {
                    return RedirectToAction("ChangePasswordSuccess");
                } else {
                    ModelState.AddModelError("", "The current password is incorrect or the new password is invalid.");
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        //
        // GET: /Account/ChangePasswordSuccess

        public ActionResult ChangePasswordSuccess() {
            return View();
        }

        #region Status Codes
        private static string ErrorCodeToString(MembershipCreateStatus createStatus) {
            // See http://go.microsoft.com/fwlink/?LinkID=177550 for
            // a full list of status codes.
            switch (createStatus) {
                case MembershipCreateStatus.DuplicateUserName:
                    return "User name already exists. Please enter a different user name.";

                case MembershipCreateStatus.DuplicateEmail:
                    return "A user name for that e-mail address already exists. Please enter a different e-mail address.";

                case MembershipCreateStatus.InvalidPassword:
                    return "The password provided is invalid. Please enter a valid password value.";

                case MembershipCreateStatus.InvalidEmail:
                    return "The e-mail address provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.InvalidAnswer:
                    return "The password retrieval answer provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.InvalidQuestion:
                    return "The password retrieval question provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.InvalidUserName:
                    return "The user name provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.ProviderError:
                    return "The authentication provider returned an error. Please verify your entry and try again. If the problem persists, please contact your system administrator.";

                case MembershipCreateStatus.UserRejected:
                    return "The user creation request has been canceled. Please verify your entry and try again. If the problem persists, please contact your system administrator.";

                default:
                    return "An unknown error occurred. Please verify your entry and try again. If the problem persists, please contact your system administrator.";
            }
        }
        #endregion
    }
}
