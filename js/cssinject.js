document.documentElement.style.visibility = "hidden";

document.addEventListener("DOMContentLoaded", function () {
	setTimeout(() => {
		document.documentElement.style.visibility = "";
	}, 150);
});

const setCookie = (name, value, days) => {
	const expires = `; expires=${new Date(Date.now() + days * 864e5).toUTCString()}`;
	document.cookie = `${name}=${value}${expires}; path=/`;
};

const getCookie = (name) => {
	const nameEQ = `${name}=`;
	const cookies = document.cookie.split(";");
	for (const c of cookies) {
		const trimmed = c.trim();
		if (trimmed.startsWith(nameEQ)) return trimmed.slice(nameEQ.length);
	}
	return null;
};
let themeid
tempcookie = getCookie("themeid");
if (tempcookie == null || tempcookie == "NaN"){
	setCookie("themeid", 0, 364);
	themeid = 0;
} else {
	themeid = parseInt(tempcookie);
}

const switchTheme = () => {
	themeid = (themeid + 1) % 2;
	setCookie("themeid", themeid, 364);
	location.reload();
};


const link = document.createElement("link");
link.type = "text/css";
link.rel = "stylesheet";
link.href = chrome.runtime.getURL("css/dark.css");

const thswitch = document.createElement("a");
thswitch.classList.add("text-light", "ml-2");
thswitch.innerHTML = `<img src="${chrome.runtime.getURL(`icons/${themeid == 1 ? 'dark' : 'light'}.svg`)}">`;
thswitch.addEventListener("click", switchTheme);

if (themeid == 1) {
	var checkhead = setInterval(() => {
		if (document.head) {
			clearInterval(checkhead);
			document.head.appendChild(link);
		}
	}, 1);
}
var checkthemeicon = setInterval(() => {
	if (document.getElementsByClassName("text-light ml-2").length == 3) {
		clearInterval(checkthemeicon);
		document.querySelector(".py-2").appendChild(thswitch);
	}
}, 1);


