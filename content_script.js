(function(window, document){
	//makeNode
	var makeNode;
	!function(n,e){var t=function(n){var t=e.createElement(n);return t.html=function(n){return t.innerHTML=n,t},t},r=function(n){for(var t,r=[],u=e.createNodeIterator(n,NodeFilter.SHOW_ELEMENT);t=u.nextNode();)r.push(t);return r},u=function(n,e){for(var t,r,u=n[0],o=n[1],i={},a=0;u>a;a++){r=o.apply(i,[a,e]);for(t in r)i.hasOwnProperty(t)?i[t].push(r[t]):i[t]=[r[t]]}return i},o=function(n){return n&&2==n.length&&n[0]&&!isNaN(n[0])},i=function(n){var t=typeof n;return"string"===t?e.createTextNode(n):"number"===t?e.createTextNode(n.toString()):n},a=function(n){for(var e,t,r=[],u=[],o=0;o<n.length;o++)if(t=n[o].n,-1==u.indexOf(t)){u.push(t),e=[n[o]];for(var i=0;i<n.length;i++)o!=i&&n[i].n==t&&e.push(n[i]);r.push(1==e.length?e[0]:{n:e[0].n,node:e.map(function(n){return n.node})})}return r},f=function(n){var e,t=function(n){var t,r=[];for(e=new RegExp("\\$\\(([^\\s()\\-.]+)\\)","g");t=e.exec(n);)r.push(t[1]);return 0==r.length?null:r};return 1==n.childNodes.length&&"#text"===n.childNodes[0].nodeName&&(result=n.innerText)?t(result):(result=n.getAttribute("offspring"))?(n.removeAttribute("offspring"),t(result)):null},l=function(n,e,t){var r;try{n.innerText=""}catch(u){}e.map(function(e){if(t.hasOwnProperty(e))if(r=t[e],r.shift)for(var u=0;u<r.length;u++)n.appendChild(i(r[u]));else n.appendChild(i(r))})},c=function(n){var e=t("template").html(n).content.childNodes[0];if(arguments.length>1){var i,c,s,h,p,d,g=arguments[1],m=[],v=r(e),N=function(){return h};arguments.length>2&&(d=arguments[2],o(d)&&(d=u(d,N)));for(var x=0;x<v.length;x++)s=v[x],i=s.getAttribute("id"),i&&!isNaN(c=parseInt(i))&&(m.push({n:c,node:s}),s.removeAttribute("id")),d&&(p=f(s))&&l(s,p,d);return m=a(m).sort(function(n,e){return n.n-e.n}).map(function(n){return n.node}),g&&"function"==typeof g&&(h=g.apply(d?d:null,m))?h:e}return e};n.makeNode=c}(window,document);
	makeNode = window.makeNode;

	//polyfill the console's xpath search function, which is not available here
	var $x=function(xpath, param, node){
		if(param){
			xpath=xpath.replace(/%s/g, param);
		}
		var node=node?node:document;
		var xresult=document.evaluate("."+xpath, node, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
		var result=[];
		var node;
		while(node=xresult.iterateNext()){result.push(node);}
		return result;
	};

})(window, document);