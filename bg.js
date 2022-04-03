chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.method){
        case 'getGroup': {
           chrome.tabs.create({url:`${request.url}`, active:false})
           sendResponse({status: 'yes'});
           break
       }
       case 'switch' : {
            if(localStorage.getItem("switch")==="false"){
                localStorage.setItem("switch", true)
            } else {localStorage.setItem("switch", false)}
       }
    }
});