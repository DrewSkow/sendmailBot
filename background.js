
let isOn;
let data;
let dataForSend = {};

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
    console.log(admArr);
    dataForSend.admire = admArr;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    if(request.method == "sendData"){
        data = request.data;
        processingDays();
        processingAdmireInput();
        dataForSend.wId = data.w_id_i;
        chrome.storage.local.set({data: dataForSend})
        chrome.tabs.create({url:`http://www.charmdate.com/clagt/admire/search_matches2.php?womanid=${data.w_id_i}&Submit=Continue+%3E%3E`});
    }

    
});


const generalFunc = (p) => {
    if(p.name == "contentChannel") {

        p.onMessage.addListener(msg => {
            chrome.storage.local.get("switcher", d => isOn=d.switcher);
            console.log(msg);
            if (isOn) {

                msg.method == "requestData"? p.postMessage({method: "data", data: dataForSend}) : false;

                msg.method == "closeTab" && chrome.tabs.remove(p.sender.tab.id);

                msg.method == "openTab" && chrome.tabs.create({url: msg.url, active:false});
            }
        })
    }
}

chrome.runtime.onConnect.addListener(p => generalFunc(p))


// arr.forEach(item => chrome.tabs.remove({tabId: item}))


