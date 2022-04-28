const delay = async (ms) => await new Promise(resolve => setTimeout(resolve, ms));
const port = chrome.runtime.connect({name: "contentChannel"});
let data;

chrome.storage.local.get(console.log);

if(document.location == "http://www.charmdate.com/clagt/admire/adr_error.php" || document.location =="https://www.charmdate.com/clagt/admire/adr_error.php"){
    port.postMessage({method: "closeTab"});
} else if (document.location.pathname ==  '/clagt/admire/adr_succ2.php'){
    port.postMessage({method: "closeTab"});
}

port.onMessage.addListener(msg => {

})


chrome.storage.local.get("data", v => data = v.data)


chrome.storage.local.get("sended", v => {
    if(v.sended ){
        delay(5000).then(()=>{
            port.postMessage({method: "closeTabs"}, ()=>{
                localStorage.clear();
                alert("Все заявки были отправлены");
            });
        });
    }else {
        chrome.storage.local.get("switcher", v => v.switcher? script(): false);
    }
})


const script = () => {

    const url = document.location;
    const pathname = url.pathname;
    const urlSearch = url.search;
    const regexW = /=\w{7}/;
    const regexM = /=\w{7,10}/;
    const regexId = /=\w{5,7}-\w{1,5}/;
    const sendButton = document.querySelector("input[name='sendmailsub']");

    const closeOnMaxOrError = () => {
        const p = document.querySelector("p");
        if(!!p && p.innerText.indexOf("to maximum quantity")>-1){ 
            chrome.storage.local.set({sended: true});
        }  else {chrome.runtime.sendMessage({method:"closeTab"});}
    }
 
    const insertGirlId = () => {
        document.location.href = `http://www.charmdate.com/clagt/admire/search_matches2.php?womanid=${data.wId}&Submit=Continue+%3E%3E`;
    }

    const setPointsInMatchPreference = () => { 
        document.querySelector('input[value = "last_login"]').checked=true
        const date = new Date();
        document.querySelector('select[name = "year_s"]').value=date.getUTCFullYear();
        document.querySelector('select[name = "month_s"]').value=date.getUTCMonth()<10? "0"+(date.getUTCMonth()+1) : date.getUTCMonth()+1;
        document.querySelector('select[name = "day_s"]').value=date.getUTCDate()<10? "0"+(date.getUTCDate()) : date.getUTCDate();
        document.querySelector(`input[value = "Y"]`).checked=true;
        document.querySelectorAll(`input[name="top20"]`)[1].checked=true;    
        document.querySelector(`input[value="Search"]`).click();
    }

    const openAllMen = () => {
        const tables = document.querySelectorAll("table")[24].children[0];
        if (!!tables){
            const quantity = tables.children.length;
            chrome.storage.local.get("turbo", data => {
                if(data.turbo){
                    for (let i = 1; i<quantity; i++) {
                        const rawRef = tables.children[i].children[8].children[0].href.split("'");
                        const ref = rawRef[1].split("%");
                        port.postMessage({method: "openTab", url:`http://www.charmdate.com/clagt/admire/${ref[0]}`});
                    }
                } else {
                    let i = 1;
                    let loop = setInterval(() => {
                        chrome.storage.local.get("sended", v => v.sended? window.reload() : false)
                        const rawRef = tables.children[i].children[8].children[0].href.split("'");
                        const ref = rawRef[1].split("%");
                        port.postMessage({method: "openTab", url:`http://www.charmdate.com/clagt/admire/${ref[0]}`});
                        if(i===quantity-1){clearInterval(loop)}
                        i++;
                    }, 1000);
                }
            })
        } else{
            openAllMen();
        }
    }

    const switchPage = () => {
        const nextButton = document.querySelectorAll("table")[25].children[0].children[0].children[1].children[3];
        const firstButton = document.querySelectorAll("table")[25].children[0].children[0].children[1].children[1];
        if(!nextButton.children[0]){
            localStorage.setItem("ended", "true");
        };
        if(!!localStorage.getItem("ended")) {
            if(!!firstButton.children[0]){
                firstButton.click();
            } else{
                document.location.reload();
            }
        } else {
            nextButton.click();
        }
    }

    function getRandomInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
        }

    const getRandomInArr = (q) => {
        return Math.floor(Math.random() * q);
    }

    const changeTypeOfLetter = async () => {

        const messTamplates = document.getElementsByClassName("mobanva")[0];

        let quantity = messTamplates.children.length

        let randomChildren;

        if(!!messTamplates) {
            if(typeof data.admire == "string"){
                for(let i = 2; i < quantity; i++){
                    if (document.getElementsByClassName("mobanva")[0].children[i].children[2].innerHTML == data.admire){
                     randomChildren = document.getElementsByClassName("mobanva")[0].children[i];
                    }
                 }
            } else if(Array.isArray(data.admire)) {
                if(data.admire[data.admire.length-1] == ","){
                    randomChildren = messTamplates.children[data.admire[getRandomInArr[data.admire.length-1]]];
                }
                randomChildren = messTamplates.children[getRandomInRange(data.admire[0]+1, data.admire[1]+1)];
            }  else if(data.admire != 0){
                    randomChildren = messTamplates.children[data.admire+1];
            } else {
                    randomChildren =  messTamplates.children[getRandomInRange(2, quantity)];
                }
            randomChildren.children[0].click();
        
        }
    }

    const checkSentMail = async (search10) => {
        let check = 0;
        await chrome.storage.local.get("data", v => data = v.data);

        await chrome.storage.local.get("data", v => console.log(v.data));

        if(data.points.length > 2){
            if(Array.isArray(data.points[0])){
                if(search10.children[1].innerHTML === "-" || (+search10.children[1].innerHTML >= data.points[0][0] && +search10.children[1].innerHTML <= data.points[0][1])) {
                    check++;
                }
            } else if(data.points[0]==-1){
                if(search10.children[1].innerHTML === "-" ||  +search10.children[1].innerHTML >= 0){
                    check++
                }
            } else {
                if(search10.children[1].innerHTML === "-" ||  +search10.children[1].innerHTML <= data.points[0]){
                    check++
                }
            }

            for(let i = 1; i<7; i++){
                if(Array.isArray(data.points[i])){
                    if(+search10.children[i+1].innerHTML >= data.points[i][0] && +search10.children[i+1].innerHTML <= data.points[i][1]) {
                        check++;
                    }
                } else if(data.points[i]==-1){
                    if(+search10.children[i+1].innerHTML >= 0){
                        check++
                    }
                } else {
                    if(+search10.children[i+1].innerHTML <= data.points[i]){
                        check++
                    }
                }
            }
        } else if(data.points.length == 2){
            if(search10.children[1].innerHTML === "-" || (+search10.children[1].innerHTML >= data.points[0] && +search10.children[1].innerHTML <= data.points[1])) {
                check++;
            } 
            for(let i = 1; i<7; i++){
                if(+search10.children[i+1].innerHTML >= data.points[0] && +search10.children[1].innerHTML <= data.points[1]) {
                    check++;
                }  
            }
        } else{
            if(search10.children[1].innerHTML === "-" ||  +search10.children[1].innerHTML <= data.points){
                check++
            }

            for(let i = 1; i<7; i++){
                if(+search10.children[1].innerHTML <= data.points){
                    check++
                }
            }
        }
        console.log(check);
        if(check===7){
            changeTypeOfLetter();
        } else {port.postMessage({method:"closeTab"})}
    }

    const sendAdmire = () => {   
        document.querySelectorAll("input[name='sendmailsub']")[0].click();
    }

    switch(pathname){
        case "/clagt/admire/adr_error.php":
            closeOnMaxOrError();
            break;

        case "/clagt/woman/women_profiles_allow_edit.php":
            insertGirlId();
            break;
        
        case "/clagt/admire/search_matches2.php":
            if(!!urlSearch.match(regexW) && !!urlSearch.match("=Continue")){
                setPointsInMatchPreference();
            }
            break;

        case "/clagt/admire/search_matches3.php" :
            chrome.storage.local.get("sended", v => {
                if(v.sended) {
                    chrome.storage.local.set({switcher: false});
                    port.postMessage({method: "closeTabs"})
                } else {
                    openAllMen();
                    delay(data.turbo?10000:25000).then(() => switchPage());
                }
            })
    }

    if(!!sendButton){
        const search10 = document.getElementsByTagName("table")[27].children[0].children[1];
        if(!!urlSearch.match(regexW) && !!urlSearch.match(regexM) && !!urlSearch.match(regexId)){
            sendAdmire();
        } else {
            checkSentMail(search10);
        }
    }
}
   