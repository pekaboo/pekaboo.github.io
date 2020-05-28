if(lang!="zh-CN"){
	document.title=i18n[lang].marquee+i18n[lang].titleSuffix
	document.getElementsByClassName("mui-title")[0].innerText=i18n[lang].marquee
	document.getElementsByTagName("input")[0].placeholder=i18n[lang].enterText
	document.getElementById("backgroundColorLabel").innerText=i18n[lang].backgroundColor.split(" ")[0]
	document.getElementById("textColorLabel").innerText=i18n[lang].textColor.split(" ")[0]
	document.getElementById("speedLabel").innerText=i18n[lang].speed
	document.getElementsByTagName("button")[0].innerText=i18n[lang].start
}
function start(){
	const newDiv=document.createElement("div"),
	newTextDiv=document.createElement("div"),
	text=document.getElementsByTagName("input")[0].value
	newDiv.classList.add("full-screen")
	newDiv.style.backgroundColor=document.getElementById("backgroundColor").value
	newDiv.style.color=document.getElementById("textColor").value
	newDiv.oncontextmenu=()=>{
		clearInterval(window.intervalId)
		newTextDiv.style.left="calc(50vw - "+(newTextDiv.offsetWidth/2)+"px)"
		return false
	}
	newDiv.onclick=stop
	newTextDiv.innerText=text
	newDiv.appendChild(newTextDiv)
	document.body.appendChild(newDiv)
	if(!text){
		const clockChanged=()=>{
			const date=new Date()
			newTextDiv.innerText=addZero(date.getHours(),2)+":"+addZero(date.getMinutes(),2)+":"+addZero(date.getSeconds(),2)
		}
		window.clock=setInterval(clockChanged,1000)
		clockChanged()
	}
	!isApp&&newDiv.requestFullscreen&&newDiv.requestFullscreen()
	window.intervalId=setInterval(()=>{
		if(innerWidth>450||newTextDiv.offsetWidth>innerHeight){
			if(newTextDiv.style.left.indexOf("calc")!=-1){
				newTextDiv.style.left=""
			}
			newTextDiv.style.top=newTextDiv.style.transform=""
			let left
			if(newTextDiv.style.left){
				left=newTextDiv.style.left.replace("px","")
			}else{
				left=innerWidth
			}
			if(left<-newTextDiv.offsetWidth){
				newTextDiv.style.left=""
			}else{
				newTextDiv.style.left=(left-5)+"px"
			}
		}else{
			newTextDiv.style.left="calc(50vw - "+(newTextDiv.offsetWidth/2)+"px)"
			newTextDiv.style.transform="rotate(90deg)"
		}
	},1000/document.getElementById("speed").value)
	hist.add(document.getElementsByTagName("input")[0].value)
}
function stop(){
	clearInterval(window.clock)
	clearInterval(window.intervalId)
	rmElement(document.getElementsByClassName("full-screen")[0])
}
document.onfullscreenchange=evt=>document.fullscreenElement!==evt.target&&stop()
document.getElementsByTagName("input")[0].onkeydown=evt=>{
	evt.keyCode==13&&start()
}
document.getElementsByTagName("button")[0].onclick=start
!isMobile&&document.getElementsByTagName("input")[0].focus()
initTextHist()
