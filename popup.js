const switcher = document.getElementById("switchButton");
chrome.storage.local.get("switcher", d => switcher.checked = d.switcher);
switcher.addEventListener('click', e => chrome.storage.local.set({switcher: e.target.checked}));

const inputArray = document.querySelectorAll("input");
inputArray.forEach(item => {
    chrome.storage.local.get(item.id, data => {
        item.value=data[item.id] || "";
    })
})

const wrapper = document.querySelector(".wrapper");
wrapper.addEventListener("input", (e) => {
    chrome.storage.local.set({[e.target.id]:e.target.value})
})

const turbo = document.getElementById("turboButton");
turbo.addEventListener('click', e => chrome.storage.local.set({turbo: e.target.checked}));
chrome.storage.local.get("turbo", d => turbo.checked = d.turbo);

const sendButton = document.getElementById("sendButton");
sendButton.addEventListener('click', e => {
    const data = {};
    chrome.storage.local.set({sended: false})
    inputArray.forEach(item => {
        if(item.id == "switchButton" || item.id == "turboButton"){data[item.id] = item.checked;}
        else {
            data[item.id] = item.value;
            // chrome.storage.local.remove([item.id]);
        }
    })
    chrome.runtime.sendMessage({method: "sendData", data})

}) 


