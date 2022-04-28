
let isOn;
let data;
let dataForSend = {};
let tabsId = [];
let womenIdArray;

chrome.storage.local.get(console.log)

const arrOfPagesId = [];
const urls = [
    "http://www.charmdate.com/clagt/admire/adr_error.php",
    "http://www.charmdate.com/clagt/admire/search_matches2.php?womanid=null&Submit=Continue+%3E%3E"
]

const processingDays = () => {
    if(data.common_day == ""){
        const daysArr = Object.keys(data)
        .map(item => {
            if(item.indexOf("d-")>-1){
                return data[item]
            }
        })
        .filter(item => item!=undefined);
    
        for(let i = 0; i < daysArr.length; i++){
            if(daysArr[i].indexOf("-") > -1){
                if(daysArr[i] == "-1"){
                    daysArr[i] = -1
                } else {
                    daysArr[i] = daysArr[i].split("-");
                }
            }
        }
    
        for(let i = 0; i < daysArr.length; i++){
            if(Array.isArray(daysArr[i])){
                for(let j = 0; j<daysArr[i].length; j++){
                    daysArr[i][j] = +daysArr[i][j]
                }
            } else daysArr[i]!=undefined && (daysArr[i] = +daysArr[i]);
        }
        dataForSend.points=daysArr;
    } else {
        if(data.common_day.indexOf("-") > -1){
            const commonDate = data.common_day.split("-");
            commonDate.forEach((item, id) => {
                commonDate[id] = +item;
            })
            dataForSend.points=commonDate;
        } else if(typeof(data.common_day) == "string"){
            dataForSend.points = +data.common_day;
        }     
    }
}

const processingAdmireInput = () => {
    let admArr
    if(data.admire_input == 0) {
        admArr = 0;
    } else if(data.admire_input.indexOf(",") >-1){
        admArr = data.admire_input.split(",");
        for(let i = 0; i<admArr.length; i++){
            admArr[i] = +admArr[i];
        }
        admArr.push(",")
    } else if(data.admire_input.indexOf("-") > -1){
        admArr = data.admire_input.split("-");
        admArr[0] = +admArr[0];
        admArr[1] = +admArr[1];
    } else if (data.admire_input.match(/[0-9]/)){
        admArr = +data.admire_input;
    } else {
        admArr = data.admire_input;
    }
    dataForSend.admire = admArr;
}

const processingId = () => {
    womenIdArray = data.w_id_i.split(",");
    dataForSend.wId = womenIdArray[0];
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
let reloaded = false;
    if(request.method == "sendData"){
        data = request.data;
        processingDays();
        processingAdmireInput();
        processingId();
        chrome.storage.local.set({data: dataForSend});
        chrome.tabs.query({groupId: -1}, v => {
            v.forEach(item => {
                if( item.title.indexOf("www.charmdate.com/clagt/admire/search_matches3.php?womanid=") > -1){
                    chrome.tabs.reload(item.id);
                    reloaded=true;
                } 
            })
        })
        setTimeout(() => {
            if(!reloaded){chrome.tabs.create({url:`http://www.charmdate.com/clagt/admire/search_matches2.php?womanid=${womenIdArray[0]}&Submit=Continue+%3E%3E`});}
        }, 1000);
    }
});

const generalFunc = (p) => {
    if(p.name == "contentChannel") {

        p.onMessage.addListener(msg => {

            chrome.storage.local.get("switcher", d => isOn=d.switcher);

            if (isOn) {

                msg.method == "closeTab" && chrome.tabs.remove(p.sender.tab.id);

                msg.method == "openTab" && chrome.tabs.create({url: msg.url, active:false}, v => tabsId.push(v.id));

                msg.method == "closeTabs" && chrome.tabs.remove(tabsId);

                if (msg.method == "reloadThisTab") {
                    chrome.tabs.reload(p.sender.tab.id);
                    chrome.storage.local.get("allMessagesSended", v => {
                        if (womenIdArray.length>0 && v.allMessagesSended){
                            chrome.storage.local.set({allMessagesSended: false})
                        }
                    })
                    
                } 

            }
        })
    }

    chrome.storage.onChanged.addListener((ch, na) => {
        if(ch?.allMessagesSended?.newValue == true){
            console.log("its work")
            if(womenIdArray.length > 1){
                chrome.tabs.query({groupId: -1}, v => {
                    v.forEach(item => {item.url.indexOf(womenIdArray[0] && chrome.tabs.remove(item.id))})
                })
                womenIdArray.shift();
                dataForSend.wId = womenIdArray[0];
                chrome.storage.local.set({data: dataForSend});
                chrome.storage.local.set({allMessagesSended: false})
                chrome.tabs.query({groupId: -1}, v => {
                    v.forEach(item => {
                        if( item.title.indexOf("www.charmdate.com/clagt/admire/search_matches3.php?womanid=") > -1){
                            chrome.tabs.reload(item.id)
                        } 
                    })
                })
                chrome.tabs.create({url:`http://www.charmdate.com/clagt/admire/search_matches2.php?womanid=${womenIdArray[0]}&Submit=Continue+%3E%3E`})
            } else { 
                chrome.storage.local.get("allMessagesSended", v => {
                    if(v.allMessagesSended && womenIdArray.length < 1){
                        console.log("vam")
                        chrome.storage.local.set({end: true});
                        chrome.storage.local.set({switcher: false});
                    }
                })

            }
        }
    });
}



chrome.runtime.onConnect.addListener(p => generalFunc(p))



