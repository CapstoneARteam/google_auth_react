(this.webpackJsonpgauth=this.webpackJsonpgauth||[]).push([[0],{13:function(e,t,n){},14:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),i=n(1),l=n.n(i),r=(n(13),n(3)),s=n(4),c=n(7),m=n(6),u=n(5),g=n.n(u),p=function(e){Object(c.a)(n,e);var t=Object(m.a)(n);function n(){var e;return Object(r.a)(this,n),(e=t.call(this)).responseGoogle=function(t){console.log(t),e.setState({username:t.profileObj.name,email:t.profileObj.email,profileimg:t.profileObj.imageUrl}),console.log(e.state)},e.state={SignedIn:!1,username:"",email:"",profileimg:""},e}return Object(s.a)(n,[{key:"render",value:function(){return o.a.createElement("div",{className:"App"},o.a.createElement("p",{id:"Name"},"Name: ",this.state.username),o.a.createElement("p",{id:"Email"},"Email: ",this.state.email),o.a.createElement("br",null),o.a.createElement("img",{id:"profileimg",src:this.state.profileimg}),o.a.createElement("br",null),o.a.createElement("br",null),this.G_login())}},{key:"G_login",value:function(){return this.state.SignedIn?o.a.createElement("div",null,o.a.createElement("p",null,"Already Signed In")):o.a.createElement(g.a,{clientId:"985223166095-8i4k79t4c9uqlq5sbe1sljmvq1cefn5r.apps.googleusercontent.com",buttonText:"Login",onSuccess:this.responseGoogle,onFailure:this.responseGoogle,cookiePolicy:"single_host_origin"})}}]),n}(a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(p,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},8:function(e,t,n){e.exports=n(14)}},[[8,1,2]]]);
//# sourceMappingURL=main.8e08e3ec.chunk.js.map