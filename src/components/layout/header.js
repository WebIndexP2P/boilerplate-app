import AccountDropdown from  './accountdropdown.js'
import PeerIdModal from './peeridmodal.js'

import * as libwip2p from 'libwip2p'

export default {
  oninit: function(vnode) {

    vnode.state.notificationColor = "#ff0000";
    vnode.state.connStateText = "Disconnected";

    vnode.state.connStateChangeHandler = function(data) {
      let state = data[0];
      
      vnode.state.connLastError = null;
      if (state == 0) {
        vnode.state.notificationColor = "#ff0000";
        vnode.state.connStateText = "Disconnected";
        libwip2p.Peers.getActivePeerSession()
        .then((session)=>{
          vnode.state.connLastError = session.connLastError;
          m.redraw();
        })
      } else if (state == 4) {
        vnode.state.notificationColor = "#00ff00";
        vnode.state.connStateText = "Connected";
      } else if (state == 3) {
        vnode.state.notificationColor = "#FF8C00";
        vnode.state.connStateText = "Unauthorized";
      } else {
        vnode.state.notificationColor = "#0000ff";
        vnode.state.connStateText = "Connecting";
      }
      m.redraw();
    }
    libwip2p.Peers.events.on('connstatechange', vnode.state.connStateChangeHandler)

    vnode.state.onPeerIdChangedHandler = function(endpoint, origPeerId, newPeerId) {
      m.mount(document.getElementsByClassName('modal-content')[0], {view:function(){
        return m(PeerIdModal, {endpoint: endpoint, origPeerId: origPeerId, newPeerId: newPeerId});
      }});
      var myModal = new bootstrap.Modal(document.getElementById('modal'));
      myModal.show();
    }
    libwip2p.Peers.events.on('peeridchanged', vnode.state.onPeerIdChangedHandler);

    vnode.state.connStateChangeHandler(libwip2p.Peers.getConnState())
  },

  onremove: function(vnode) {
      libwip2p.Peers.events.off('connstatechange', vnode.state.connStateChangeHandler)
      libwip2p.Peers.events.off('peeridchanged', vnode.state.onPeerIdChangedHandler);
  },

  oncreate: function(vnode) {
    var tooltipTriggerList = [].slice.call(document.getElementById("mainnav").querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      let tmpTooltip = new bootstrap.Tooltip(tooltipTriggerEl, {trigger : 'hover'});
      tooltipTriggerEl.addEventListener('click', function(){
        setTimeout(function(){
          tmpTooltip.hide();
        }, 500)
      })
      return tmpTooltip
    })
  },

  view: function(vnode){
    return m("nav.navbar ps-3 navbar-expand", {id:"mainnav", style:"padding:0px;background-color:#222222;"},
      m(m.route.Link, {href:"/", class:"navbar-brand"},
        m("img", {src:"assets/app_192_rounded.png", style:"height: 43px; width: 43px; margin-right: 10px;"}),
        m("span", {style:"color:#ffffff;"}, "Boilerplate Wip2p")
      ),
      m(".collapse navbar-collapse",

      ),
      m("div",
        m("div", {style:"display:inline-block;"},
          m("div.dropdown me-2",
            m("a.px-1", {id:"notifications", style:"color: #ced4da; outline:none;", href:"#", "data-bs-toggle":"dropdown"},
              m("i.fa fa-bell"),
              m("span.notification-icon", {style:"background-color:" + vnode.state.notificationColor})
            ),
            m(".dropdown-menu dropdown-menu-end",
              m("a.dropdown-item", {href:"#"},
                m(".d-flex align-items-center",
                  m("i.fas fa-star"),
                  m(".text ms-2",
                    m("p.mb-0", "No notifications")
                  )
                )
              ),
              m(".dropdown-divider"),
              m("a.dropdown-item", {href:"#"},
                m("small", vnode.state.connStateText),
                m("div.text-danger", m("small", vnode.state.connLastError))
              )
            )
          )
        ),
        m("div.me-2 mb-2 mt-2", {style:"display:inline-block;"},
          m(AccountDropdown)
        )
      )
    )
  }
}

