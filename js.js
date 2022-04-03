const btn = document.getElementsByClassName("switch-btn")[0]

if(localStorage.getItem("switch") == "true"){btn.classList.add("switch-on")}

const sw = () => {
    if(document.getElementsByClassName("switch-on")[0]){
        btn.classList.remove("switch-on")
    } else {
        btn.classList.add("switch-on")
    }
    chrome.runtime.sendMessage({method: "switch"})
}

btn.addEventListener("click", sw)



