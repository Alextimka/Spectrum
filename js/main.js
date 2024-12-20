// Check the browser
if (typeof browser === "undefined") {
	var browser = chrome;
}

// Cookie functions
function setCookie(name, value, days) {
	var expires;
	if (days == 0) {
		expires = "; expires=;";
	} else {
		expires = `; expires=${new Date(Date.now() + days * 864e5).toUTCString()}`;
	}
	document.cookie = `${name}=${value}${expires}; path=/`;
}

function getCookie(name) {
	const nameEQ = `${name}=`;
	const cookies = document.cookie.split(";");
	for (const c of cookies) {
		const trimmed = c.trim();
		if (trimmed.startsWith(nameEQ)) return trimmed.slice(nameEQ.length);
	}
	return null;
}

// Check if user is logged in using the avatar element
function isLogged() {
	if (!document.getElementsByClassName("nav-item user_add")[0]) {
		return true;
	} else {
		if(document.getElementsByClassName("nav-item user_add")[0].firstElementChild.title=="Регистрация"){
			return false;
		} else {
			return true;
		}
	}
}

// Switch between 0 and 1 function
// 0 - Light; 1 - Dark
function switchTheme() {
	themeid = (themeid + 1) % 2;
	setCookie("themeid", themeid, 364);
	location.reload();
}

// Get latest version
async function latest() {
	let ver = await fetch("https://api.github.com/repos/Alextimka/Spectrum/tags")
		.then((response) => response.json())
		.then((json) => json[0].name);
	ver = parseFloat(ver.substr(ver.length - 3));
	return ver;
}

// Insert features function
async function insert() {
	var isLoggedIn = isLogged();
	try {
		// Append theme switch
		if (isLoggedIn)	document.querySelector(".py-2").appendChild(thswitch);
	} catch {}
	try {
		// Check if the user is logged in
		// If not, reset theme cookie
		if (!isLoggedIn) {
			if (themeid == 1) {
				themeid = 0;
				setCookie("themeid", themeid, 0);
				location.reload();
			}
		} else {
			setCookie("themeid", themeid, 364);
		}
	} catch {}
	try {
		// Replace logo with high quality one
		document.getElementsByClassName("d-sm-none")[0].src = "/upload/000/u1/e/8/e83ef3bf.png";
	}	catch {}
	try {
		// Check if a newer version is available
		if (currVer < (await latest())) {
			credText += `%20(${browser.i18n.getMessage("creditImg")})`;
		}
		creditImg.src = `https://img.shields.io/badge/Spectrum%20v${credText}-4d4d4d?logo=github`;

		// Append credit
		credit.append(creditImg);
	} catch {}
	try {
		document
			.getElementsByClassName("d-flex align-items-center text-muted icms-links-inherit-color")[0]
			.append(credit);
	} catch {}
}

// Hide the page until it is fully loaded
document.documentElement.style.visibility = "hidden";

// If cookie is null or NaN reset back to 0
let darkbg;
let themeid;
tempcookie = getCookie("themeid");
if (tempcookie == null ||	tempcookie == "NaN" || tempcookie > 1 || tempcookie < 0) {
	setCookie("themeid", 0, 364);
	themeid = 0;
} else {
	themeid = parseInt(tempcookie);
}

// Append dark theme css
if (themeid == 1) {
	darkbg = Object.assign(document.createElement("style"), {
		innerHTML: `html > body {
			background-color: #1b1b1b !important;
		}`,
	});
	const link = Object.assign(document.createElement("link"), {
		type: "text/css",
		rel: "stylesheet",
		href: browser.runtime.getURL("css/dark.css"),
	});

	document.documentElement.prepend(darkbg);
	document.addEventListener("DOMContentLoaded", () => {
		document.head.appendChild(link);
	});
}

// Theme switch svg
const themeSvg = Object.assign(document.createElement("img"), {
	src: browser.runtime.getURL(`icons/${themeid == 1 ? "dark" : "light"}.svg`),
});

// Theme switch
const thswitch = Object.assign(document.createElement("a"), {
	classList: "text-light ml-2",
	href: "#"
});
thswitch.append(themeSvg);
thswitch.addEventListener("click", switchTheme);

// Spectrum credit at the bottom
let credit = Object.assign(document.createElement("a"), {
	href: browser.i18n.getMessage("creditUrl"),
	title: browser.i18n.getMessage("creditTitle"),
	target: "_blank",
});

// Credit image
var credText = browser.runtime.getManifest().version;
const currVer = parseFloat(credText.substr(credText.length - 3));
const creditImg = document.createElement("img");

// Show the page when it is fully loaded and append features
document.addEventListener("DOMContentLoaded", () => {
	insert();
	setTimeout(() => {
		document.documentElement.style.visibility = "";
	}, 150);
	if (themeid == 1) {
		darkbg.remove();
	}
});

