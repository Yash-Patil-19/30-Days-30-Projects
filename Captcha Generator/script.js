
const display = document.getElementById("status");
const body = document.body;
const submit = document.getElementById("submit");
const refresh = document.getElementById("refresh");

const char = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

let captcha = "";

body.onload = function generateCaptcha(){
    captcha = "";
    const captchaLength = 6;
    for(let i = 0; i<captchaLength; i++){
        const randomIndex = Math.floor(Math.random() * char.length);
        captcha += char[randomIndex];
    }

    document.getElementById("generator").value = captcha;
    display.innerText = "Captcha Generator";
}

submit.onclick = function checkInput(){
    const input = document.getElementById("client-text").value;

    if(input === ""){
        display.innerText = "Please Enter the text Shown below👇";
    }else if(input === captcha){
        display.innerText = "Matched😎";
    }else{
        display.innerText = "Not-Matched😖";
    }
}

refresh.onclick = function refreshCaptcha(){
    captcha = "";
    for(let i = 0; i < 6; i++){
        captcha += char[Math.floor(Math.random() * char.length)];
    }
    document.getElementById("generator").value = captcha;
    display.innerText = "Captcha Generator";
}