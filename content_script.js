(function (window, document){
	//makeNode
	var makeNode;
	!function(n,e){var t=function(n){var t=e.createElement(n);return t.html=function(n){return t.innerHTML=n,t},t},r=function(n){for(var t,r=[],u=e.createNodeIterator(n,NodeFilter.SHOW_ELEMENT);t=u.nextNode();)r.push(t);return r},u=function(n,e){for(var t,r,u=n[0],o=n[1],i={},a=0;u>a;a++){r=o.apply(i,[a,e]);for(t in r)i.hasOwnProperty(t)?i[t].push(r[t]):i[t]=[r[t]]}return i},o=function(n){return n&&2==n.length&&n[0]&&!isNaN(n[0])},i=function(n){var t=typeof n;return"string"===t?e.createTextNode(n):"number"===t?e.createTextNode(n.toString()):n},a=function(n){for(var e,t,r=[],u=[],o=0;o<n.length;o++)if(t=n[o].n,-1==u.indexOf(t)){u.push(t),e=[n[o]];for(var i=0;i<n.length;i++)o!=i&&n[i].n==t&&e.push(n[i]);r.push(1==e.length?e[0]:{n:e[0].n,node:e.map(function(n){return n.node})})}return r},f=function(n){var e,t=function(n){var t,r=[];for(e=new RegExp("\\$\\(([^\\s()\\-.]+)\\)","g");t=e.exec(n);)r.push(t[1]);return 0==r.length?null:r};return 1==n.childNodes.length&&"#text"===n.childNodes[0].nodeName&&(result=n.innerText)?t(result):(result=n.getAttribute("offspring"))?(n.removeAttribute("offspring"),t(result)):null},l=function(n,e,t){var r;try{n.innerText=""}catch(u){}e.map(function(e){if(t.hasOwnProperty(e))if(r=t[e],r.shift)for(var u=0;u<r.length;u++)n.appendChild(i(r[u]));else n.appendChild(i(r))})},c=function(n){var e=t("template").html(n).content.childNodes[0];if(arguments.length>1){var i,c,s,h,p,d,g=arguments[1],m=[],v=r(e),N=function(){return h};arguments.length>2&&(d=arguments[2],o(d)&&(d=u(d,N)));for(var x=0;x<v.length;x++)s=v[x],i=s.getAttribute("id"),i&&!isNaN(c=parseInt(i))&&(m.push({n:c,node:s}),s.removeAttribute("id")),d&&(p=f(s))&&l(s,p,d);return m=a(m).sort(function(n,e){return n.n-e.n}).map(function(n){return n.node}),g&&"function"==typeof g&&(h=g.apply(d?d:null,m))?h:e}return e};n.makeNode=c}(window,document);
	makeNode = window.makeNode;

	//groupBy
	Array.prototype.groupBy=function(){var r=function(r,e){var n=[e];return{key:r,members:n,add:function(r){n.push(r)}}};return function(e,n){n=n||function(r,e){return r==e};for(var t,u,i=[],o=0;o<this.length;o++){u=e(this[o]),t=!0;for(var a=0;a<i.length;a++)if(n(i[a].key,u)){t=!1,i[a].add(this[o]);break}t&&i.push(r(u,this[o]))}return i.map(function(r){return{key:r.key,members:r.members}})}}();

	
	(function(arr1, arr2, $, iframeLocation, ourLocation){
		iframeLocation = iframeLocation.replace(/\/[^\/]*$/g,'/');
		var win;
		var onClickEverywhereExcept=function(elements, handler){
			var $windocument = $(win.document);
			console.log($windocument);
			$windocument.on('click',function(e){
				if(!e.originalEvent.path.some(function(e){return elements.some(function(f){return f===e});})){

					handler(e);
				}
			});
		};
		var maketable2=function(arr, bg, win, testHistoryLinks){
			return makeNode('<div id="1" style="background-color:'+bg+';margin:3px;padding:3px"><table id="2" style="width:100%" offspring="$(rows)"></table></div>',
				function(div, table){
					var self=this;
					win.document.body.appendChild(div);
					var selection = (function(){
						var rows = [];
						var doToRows = function(what, clearAfter){
							rows.map(what);
							if(clearAfter){
								clear();
							}
						};
						var removeRow = function(r){rows.splice(rows.indexOf(r), 1);if(rows.length <= 0){button.hide();}};
						var clear = function(){
							doToRows(function(r){r.appearSelected(false);});
							rows = [];
							button.hide();
						};
						var invert = function(){
							doToRows(function(r){r.appearSelected(false);});
							var toKeep = self.rowObjects.filter(function(r){return rows.indexOf(r) == -1;});
							rows = toKeep;
							doToRows(function(r){r.appearSelected(true);});
							if(rows.length <= 0){button.hide();}
						};
						var button = makeNode('<div id="1" style="position:fixed;right:30px;top:30px;display:none"><input type="button" value="remove" id="2"/><input type="button" value="invert" id="3"/><input type="button" value="clear" id="4"/></div>',
							function(div, button, button2, button3){
								win.document.body.appendChild(div);
								button.onclick = function(){
									doToRows(function(row){row.remove();}, true);
								};
								button2.onclick = invert;
								button3.onclick = clear;
								return {
									show:function(){div.style.display="initial";},
									hide:function(){div.style.display="none";}
								};
							});
						return {
							addRow:function(r){rows.push(r);button.show();},
							removeRow:removeRow,
							doToRows:doToRows
						};
					})();
					var r={
						table:table,
						text:function(){
							var diagnoses=self.diagnoseLine.map(function(l){return l();}).filter(function(l){return l.commentary}).groupBy(function(l){return l.commentary}).map(function(g){
								return g.members.map(function(m){return m.name;}).join('\n')+"\n--->"+g.key;
							});
							
							return diagnoses.join('\n\n');
						},
						selectRow:selection.addRow,
						deselectRow:selection.removeRow
					};
					return r;
				},
				[arr.length, function(rowIndex, getToReturn){
					var row, self=this;
					var highlightOn=function(index){
						self.highlight.map(function(f,i){f(i==index);});
					};
					var getCommentaryList=function(){
						var l0=self.commentary.map(function(f){return f();});
						var l1=[];
						for(var i=0;i<l0.length;i++){
							if(l1.indexOf(l0[i])==-1 && l0[i]){
								l1.push(l0[i]);
							}
						}
						return l1;
					};
					var select = function(){getToReturn().selectRow(row);};
					var deselect = function(){getToReturn().deselectRow(row);};
					row=makeNode('<tr id="4"><td><div id="1"><a id="2" style="cursor:pointer;color:#000;font:normal 80% Verdana, Helvetica, Arial, sans-serif">$(text)</a></div></td><td><a style="cursor:pointer" id="9">history</a></td><td><a id="7" style="cursor:pointer">edit</a></td><td><a id="6" style="cursor:pointer">see</a></td><td><input type="checkbox" id="8"/></td><td><textarea id="3"></textarea></td><td><a id="5" style="cursor:pointer">x</a></td></tr>',
								function(div, a, textarea, tr, a2, a3, a4, checkbox, aHistory){
									var self=this;
									var hideOptions=null;
									a.onmouseover=function(){a.style.color="#666";};
									a.onmouseout=function(){a.style.color="#000";};
									a.onclick=(function(path, index){
										return function(){
											textarea.focus();
											highlightOn(index);
											win.open('http://localhost/'+path+'?test');
										}
									})(this.text, rowIndex);
									a4.onclick=(function(path, index){
										return function(){
											textarea.focus();
											highlightOn(index);
											win.open('http://localhost/'+path);
										}
									})(this.text, rowIndex);
									aHistory.onclick=(function(path, index){
										return function(){
											textarea.focus();
											highlightOn(index);
											win.open(path);
										}
									})(testHistoryLinks.filter(function(entry){return self.text.endsWith(entry.name);})[0].testHistoryLink, rowIndex);
									a3.onclick=(function(href, index){
										return function(){
											textarea.focus();
											highlightOn(index);
											win.open(iframeLocation+href);
										};
									})(this.href, rowIndex);
									checkbox.onclick=function(){
										if(checkbox.checked){
											select();
										}else{
											deselect();
										}
									};
									var remove = function(){
										console.log("removing row");
										getToReturn().table.removeChild(tr);
										if(hideOptions){hideOptions();}
									};
									a2.onclick=remove;
									var highlight=function(bool){tr.style.backgroundColor=bool?"rgba(50,50,50,0.2)":"";};
									var commentary=function(){return textarea.value;};
									var diagnoseLine=function(){
										var comm=commentary();
										return {commentary:comm,name:self.text};
									};
									var showOptions=function(arr){
										if(!arr.some(function(t){return t;})){return;}
										var $txt=$(textarea);
										var offset=$txt.offset();
										hideOptions=makeNode('<div id="1" style="position:absolute;left:'+offset.left+'px;top:'+(offset.top+$txt.height()+5)+'px;width:'+$txt.width()+'px;background-color:#fff;border:1pt solid #000">$(options)</div>',
											function(div){
												win.document.body.appendChild(div);
												var remove=function(){win.document.body.removeChild(div);hideOptions=null;};
												//textarea.onblur=function(){if(textarea.value!=""){remove();}};
												onClickEverywhereExcept([textarea, div],function(){console.log("nope");try{remove();}catch(e){}});
												return remove;
											},[arr.length,function(i, getToReturn){
												return {
													options:makeNode('<div id="1" style="cursor:pointer;font-family:monospace">'+arr[i]+'</div>',
														function(a){
															a.onclick=function(e){textarea.value=arr[i].replace(/&nbsp;/g,"");getToReturn()();};
														})
												};
											}]);
									};
									var appearSelected = function(bool){
										console.log("appearSelected");
										checkbox.checked = bool;
									};
									textarea.addEventListener('focus',function(){
										highlightOn(rowIndex);
										if(hideOptions==null){showOptions(getCommentaryList())}
									});
									return {
										tr:tr,
										highlight:highlight,
										diagnoseLine:diagnoseLine,
										commentary:commentary,
										remove:remove,
										appearSelected:appearSelected
									};
								},
								{text:arr[rowIndex].innerHTML, href:$(arr[rowIndex]).attr('href')}
								);
					return {
						rowObjects: row,
						rows:row.tr,
						highlight:row.highlight,
						diagnoseLine:row.diagnoseLine,
						commentary:row.commentary
					};
				}]
				);
		};
		var getTestHistoryLinks = function(doneCallback){
			var result;
			win = window.open(ourLocation.href.replace(/&tab=.*$/,''));
			setTimeout(function(){
				result = Array.prototype.map.call(win.document.getElementsByClassName('testNamePopup'), function(e){
					var $e = $(e);
					var name = $('.testWithDetails', $e).text().replace(/^\s+|\s+$/,'');
					var id = $e.attr('id');
					var popup = win.document.getElementById(id+"Content");
					var $popup = $(popup);
					var testHistoryLink = ourLocation.origin + $('a:contains("Test History")', $popup).attr('href');
					return {name:name,testHistoryLink:testHistoryLink};
				});
				win.close();
				doneCallback(result);
			},500);
		};
		var open = function(testHistoryLinks){
			win=window.open();
			var fail=maketable2(arr1, "#FFAAAA", win, testHistoryLinks);
			var error=maketable2(arr2, "#FFFFAA", win, testHistoryLinks);

			makeNode('<div id="1"><input id="2" type="button" value="Print"></div>',
				function(div, input){
					win.document.body.appendChild(div);
					var showing=false;
					var textArea;
					input.onclick=function(){
						if(!showing){
							div.appendChild(textArea=makeNode('<textarea style="width:75%;height:20%"></textarea>'));
							showing=true;
						}
						textArea.innerHTML="--- FAIL: ---\n"+fail.text()+"\n--- ERROR: ---\n"+error.text();
					}
				});

			makeNode('<div id="1" style="width:10px;height:200px"></div>',
				function(div){
					win.document.body.appendChild(div);
				});
		};
		getTestHistoryLinks(open);
	})(
		Array.prototype.slice.apply(document.getElementById('iframe').contentWindow.document.querySelectorAll('tr.fail a:nth-child(1)'), null),
		Array.prototype.slice.apply(document.getElementById('iframe').contentWindow.document.querySelectorAll('tr.error a:nth-child(1)'), null),
		window.jQuery,
		document.getElementById('iframe').contentWindow.location.href,
		window.location
	);

})(window, document);