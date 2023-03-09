import * as MithrilNav from './lib/mithrilnav.js'
import Version from './lib/version.js'
import PublicCheck from './lib/publiccheck.js'
import PageLayout from './components/layout/pagelayout.js'
import PageMain from './components/main.js'
import PageSettings from 'wip2p-settings'
import NoInviteModal from './components/noinvitemodal.js'
import DisconnectModal from './components/disconnectmodal.js'

MithrilNav.overrideMithrilRouting();
MithrilNav.restoreScrollPositions();

var libwip2p = window.libwip2p;

window.Buffer = libipfs.buffer.Buffer;
window.Cid = libipfs.multiformats.CID;

window.logWebsocket = localStorage.getItem('logWebsocket');
if (window.logWebsocket == "true")
  window.logWebsocket = true;
else
  window.logWebsocket = false;

window.showDebugControls = localStorage.getItem('showDebugControls');
if (window.showDebugControls == "true")
  window.showDebugControls = true;
else
  window.showDebugControls = false;

window.showColorBackgrounds = localStorage.getItem('showColorBackgrounds');
if (window.showColorBackgrounds == "true")
  window.showColorBackgrounds = true;
else
  window.showColorBackgrounds = false;

libwip2p.useLocalStorage(true);
libwip2p.Account.initWallet();

libwip2p.Peers.events.on("connstatechange", function(state, manualDisconnect){
  //console.log(state);
  if (state == 3) {
    var myModal = bootstrap.Modal.getInstance(document.getElementById('modal'));
    if (myModal != null) {
      myModal.hide();
    }
    //console.log('show redeem invite screen');
    m.mount(document.getElementsByClassName('modal-content')[0], NoInviteModal);
    var myModal = new bootstrap.Modal(document.getElementById('modal'));
    myModal.show();
  }

  if (state == 0 && !manualDisconnect) {
    var myModal = bootstrap.Modal.getInstance(document.getElementById('modal'));
    if (myModal != null) {
      myModal.hide();
    }

    m.mount(document.getElementsByClassName('modal-content')[0], DisconnectModal);
    var myModal = new bootstrap.Modal(document.getElementById('modal'));
    myModal.show();
  }
})

libwip2p.Peers.init()
.then(()=>{
  if (window.location.hash.startsWith("#!/boot/")) {
    var bootPeer = window.location.hash.substring(8);
    return libwip2p.Peers.addPeer(bootPeer);
  } else {
    if (libwip2p.Peers.getPeers().length == 0) {
      return libwip2p.Peers.addPeer("wss://tulip.wip2p.com");
    }
  }
})
.then(()=>{
  // make sure we always subscribe to new bundle events
  libwip2p.Peers.events.on('peerconnected', function(){
    libwip2p.Peers.getActivePeerSession()
    .then((ps)=>{
      ps.onBundleReceived = function(bundle){
        libwip2p.Loader.fetchOne(bundle.account, {replaceCache: true});
      }
    })
  })

  // load the UI
  var a = document.getElementById('app');

  let settingsConfig = {
    hideEth: true,
    hideIpfs: true,
    name:"BoilerplateWip2p",
    version: "v" + Version,
    description: m("span", " is a ... All data is stored in ", m("a[href='https://wip2p.eth.link']", {target:"_blank"}, "WebIndexP2P"), " nodes run by volunteers."),
    icon:"assets/app_192_rounded.png"
  }

  m.route(a, "/", {
    "/": {render: function() {
      return m(PageLayout, {}, m(PageMain))
    }},
    "/view/:address/:id": {render: function() {
      return m(PageLayout, {}, m(PageView))
    }},
    "/settings": {render: function() {
        return m(PageLayout, {}, m(PageSettings, settingsConfig))
    }},
    "/settings/:tab": {render: function() {
      return m(PageLayout, {}, m(PageSettings, settingsConfig))
    }},
  })

  document.getElementsByClassName("loader")[0].classList.add('fadeout');

  //load root to see if public
  PublicCheck();
})
