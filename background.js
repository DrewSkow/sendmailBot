
let isOn;
let data;

const arrOfPagesId = [];
const urls = [
    "http://www.charmdate.com/clagt/admire/adr_error.php",
    "http://www.charmdate.com/clagt/admire/search_matches2.php?womanid=null&Submit=Continue+%3E%3E"
]

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    request.method == "openTab" && chrome.tabs.create({url:`${request.url}`, active:false}, v => arrOfPagesId.push(v.id));

    request.method == "closeTab" && sender.url != "http://www.charmdate.com/clagt/woman/women_profiles_allow_edit.php" && chrome.tabs.remove(sender.tab.id);

    request.method == "sendData" && (data = request.data);

    if (request.method == "closeTabs") { 
        arrOfPagesId.length=0;
        chrome.tabs.query({active: false, url:urls}, arr => {
            arr.forEach(i => arrOfPagesId.push(i.id));
            chrome.tabs.remove(arrOfPagesId);
        })
    }

});


const processingData = () => {

}

const generalFunc = (p) => {
    if(p == "contentChannel") {
        p.onMessage.addListener(msg => {
            chrome.storage.local.get("switcher", d => isOn=d.switcher);
            if (isOn) {
                if(msg.method == "dataRequest"){

                }
            }
        })
    }
}

chrome.runtime.onConnect.addListener(p => generalFunc(p))



