chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.method){
        case 'getGroup': {
           chrome.tabs.create({url:`${request.url}`, active:false})
           sendResponse({status: 'yes'});
           break;
       }
    }
});

