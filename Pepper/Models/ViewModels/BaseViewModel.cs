using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace Pepper.ViewModels {
    public class BaseViewModel {
        private string _hostUrl;
        public string HostUrl {
            get {
                if (this._hostUrl == null) {
                    _hostUrl = System.Web.HttpContext.Current.Request.Url.Host;
                }
                return _hostUrl;
            }
            set {
                _hostUrl = value;
            }
        }
    }
}
