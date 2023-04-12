let sE = document.getElementById('scrapeEmails');
let list = document.getElementById('emailList');
let detectButton = document.getElementById('detectButton');

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

// let emailBodyPath = getElementByXpath("/html[1]/body[1]/div[7]/div[3]/div[1]/div[2]/div[5]/div[1]/div[1]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[1]/table[1]/tr[1]/td[1]/div[2]/div[2]/div[1]/div[3]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[3]/div[3]")
// let emailBody = emailBodyPath.innerText;
// console.log(emailBody);

// let lisst = document.getElementByXpath("/html[1]/body[1]/div[7]/div[3]/div[1]/div[2]/div[5]/div[1]/div[1]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[1]/table[1]/tr[1]/td[1]/div[2]/div[2]/div[1]/div[3]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[3]/div[3]/div[1]")

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    let emails = request.emails;
    if(emails == null || emails.length == 0) { 

        let li = document.createElement('li');
        li.innerText = 'No emails found on this page';
        list.appendChild(li);
    } else {
        emails.forEach((email) => {
            let li = document.createElement('li');
            li.innerText = email;
            li.style = 'color: blue; font-size: 12px; font-weight: 500;font-family: Raleway;text-align: center; font-size: 1rem;padding: 0.5rem;';
            list.appendChild(li);
        })
    }
})

sE.addEventListener('click', async () => {
    let[tab] = await chrome.tabs.query({active: true, currentWindow: true});
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: scrapeEmailsFromPage
    });
});

function scrapeEmailsFromPage() {
    const emailRegEx = /[\w\.=-]+@[\w\.-]+\.[\w]{2,3}/gim;
    let emails = document.body.innerHTML.match(emailRegEx);

    chrome.runtime.sendMessage({emails});
}  

detectButton.addEventListener('click', () => {
    chrome.tabs.query({currentWindow: true, active:true}, 
        function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, 'Hi', setCount)
        })
        function setCount(res) {
            if (res.count > 12){
                const div = document.createElement('div')
                div.textContent = 'This is a phishing email!'
                div.style = 'color: red; font-weight: 700;font-size: 18px; font-family: Raleway; text-align: center; font-size: 1.5rem;padding: 2rem; background-color: #f2f2f2;'
                document.body.appendChild(div)
            }
            else {
                const div = document.createElement('div')
                div.textContent = 'This is not a phishing email!'
                div.style = 'color: green; font-size: 18px; font-weight: 700;font-family: Raleway;text-align: center; font-size: 1.5rem;padding: 2rem;background-color: #f2f2f2;'
                document.body.appendChild(div)
            }
            const br = document.createElement('br')
            document.body.appendChild(br)
        }


});

// document.addEventListener('DOMContentLoader', function(){
//     document.querySelector('button').addEventListener('click', onclick, false)

//     function onclick() {
//         chrome.tabs.query({currentWindow: true, active:true}, 
//             function(tabs){
//                 chrome.tabs.sendMessage(tabs[0].id, 'Hi', setCount)
//             })
//     }
//     function setCount(res) {
//         if (res.count > 6){
//             const div = document.createElement('div')
//             div.textContent = 'This is a phishing email!'
//             div.style = 'color: red; font-size: 18px;'
//             document.body.appendChild(div)
//         }
//         else {
//             const div = document.createElement('div')
//             div.textContent = 'This is not a phishing email!'
//             div.style = 'color: green; font-size: 18px;'
//             document.body.appendChild(div)
//         }
//         const br = document.createElement('br')
//         document.body.appendChild(br)
//     }
// }, false)

