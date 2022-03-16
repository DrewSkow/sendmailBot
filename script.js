const url = document.location;
const pathname = url.pathname;
const urlSearch = url.search;
const regexW = /=\w{7}/;
const regexM = /=\w{7,10}/;
const regexId = /=\w{5,7}-\w{1,5}/;
const sendButton = document.querySelector("input[name='sendmailsub']");

if(+localStorage.getItem("sended") >= 50){
    confirm("50 запросов были отправлены")? localStorage.clear(): alert("50 запросов были отправлены, пожалуйста отключите это расширение или смените анкету!");
}   

const delay = async (ms) => await new Promise(resolve => setTimeout(resolve, ms));

const closeOnMaxOrError = () => {
    const p = document.querySelector("p");
    if(!!p? p.innerText.indexOf("to maximum quantity")>-1 : false){
        localStorage.setItem("sended", "50");
    }
    window.close();
}

const insertGirlId = () => {
    let girlId = prompt("Введите ID девушки");
    if(!!localStorage.sended){
        confirm("Хотите ли вы начать поиск заново?") && localStorage.clear();
    }
    let sended = prompt("введите количество отправленных заявок или 0");
    localStorage.setItem("sended", sended);
    document.location.href = `http://www.charmdate.com/clagt/admire/search_matches2.php?womanid=${girlId}&Submit=Continue+%3E%3E`;
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
        for (let i = 1; i<quantity; i++) {
            const rawRef = tables.children[i].children[8].children[0].href.split("'");
            const ref = rawRef[1].split("%");
            window.open(`http://www.charmdate.com/clagt/admire/${ref[0]}`); 
        }
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

const changeTypeOfLetter = () => {
    const messTamplates = document.getElementsByClassName("mobanva")[0]
    if(!!messTamplates){
        const quantity = messTamplates.children.length
        const randomChildren =  messTamplates.children[getRandomInRange(2, quantity)];
        if(!!randomChildren){
            randomChildren.children[0].click();
        } else {
            changeTypeOfLetter();
        }
    } else {
        changeTypeOfLetter();
    }

}

const checkSentMail = (search10) => {
        let check = 0;
        for(let i = 1; i < 8; i++){
            if(search10.children[i].innerHTML == "10"){check++;}
        }
        if(check < 4){ 
            window.close() 
        } else { 
            changeTypeOfLetter()
        }
}

const sendAdmire = () => {   
    document.querySelectorAll("input[name='sendmailsub']")[0].click();
    const sent = +localStorage.getItem("sended");
    localStorage.setItem("sended",sent+1);
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
        openAllMen();
        delay(30000).then(() => switchPage());
        break;

    case "/clagt/admire/adr_succ2.php":
        window.close();
        break;
}

if(!!sendButton){
    const search10 = document.getElementsByTagName("table")[27].children[0].children[1];
    if(!!urlSearch.match(regexW) && !!urlSearch.match(regexM) && !!urlSearch.match(regexId)){
        sendAdmire();
    } else {
        checkSentMail(search10);
    }
}





