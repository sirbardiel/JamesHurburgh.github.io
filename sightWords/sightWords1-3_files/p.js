var ignorePaths = [
  '/apps/auth',
  '/apps/webstore/stores/update_cart'
];

function shouldWarn() {
  for (var i = 0; i < ignorePaths.length; i++) {
    if (window.location.pathname.indexOf(ignorePaths[i]) != -1) {
      return false;
    }
  }
  return true;
}

if (shouldWarn()) {
	var oldOnBeforeUnload = window.onbeforeunload;
	function fw_confirmExit() {
    try {
      var siteIdentifier = webs && webs.stats && webs.stats.siteId || window.location.hostname;
      _gaq.push(['_trackEvent', 'spam', 'earlyUnload', siteIdentifier]);
    } catch (e) {
    } finally {
      return "WARNING! This page is attempting to forward you to another site. If you do not trust this site, you should click CANCEL.";
    }
  }
	window.onbeforeunload = fw_confirmExit;
	window.setTimeout(function() { window.onbeforeunload = oldOnBeforeUnload; }, 600);
}
