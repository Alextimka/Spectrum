// Check the browser
if (typeof browser === "undefined") {
	var browser = chrome;
}

// Get User id
function getUserId() {
	try {
		return document
			.getElementsByClassName("nav-item profile")[0]
			.firstElementChild.href.split("/")[4];
	} catch {
		return null;
	}
}

// Cookie functions
function setCookie(name, value, days) {
	var expires;
	if (days == 0) {
		expires = "; expires=;";
	} else {
		expires = `; expires=${new Date(
			Date.now() + days * 864e5
		).toUTCString()}`;
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
function isLoggedIn() {
	if (
		document.getElementsByClassName("nav-item user_add")[0].firstElementChild.title == "Регистрация"
	) {
		return true;
	} else {
		return false;
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
	let ver = await fetch(
		"https://api.github.com/repos/Alextimka/Spectrum/tags"
	)
		.then((response) => response.json())
		.then((json) => json[0].name);
	ver = parseFloat(ver.substr(ver.length - 3));
	return ver;
}

// Insert features function
function insert() {
	try {
		// Append theme switch
		document.querySelector(".py-2").appendChild(thswitch);
	} catch {}
}

async function insertAfter() {
	try {
		var isLogged = isLoggedIn();
		if (!isLogged) {
			var expTheme = getCookie("expirationTheme");
			if (expTheme == 1 && themeid == 1) {
				themeid = 0;
				setCookie("themeid", themeid, 0);
				setCookie("expirationTheme", 0, 364);
				location.reload();
			}
			if (expTheme == 1) {
				setCookie("expirationTheme", 0, 364);
				setCookie("themeid", themeid, 0);
			}
		} else {
			setCookie("expirationTheme", 1, 364);
			setCookie("themeid", themeid, 364);
		}
	} catch {}
	try {
		// Check if a newer version is available
		if (currVer < (await latest())) {
			credText += `%20(${browser.i18n.getMessage("creditImg")})`;
		}
	} catch {}
	creditImg.src = `https://img.shields.io/badge/Spectrum%20v${credText}-4d4d4d?logo=github`;

	// Append credit
	credit.append(creditImg);

	try {
		document
			.getElementsByClassName(
				"d-flex align-items-center text-muted icms-links-inherit-color"
			)[0]
			.append(credit);
	} catch {}
}
// Hide the page until it is fully loaded
document.documentElement.style.visibility = "hidden";

// If cookie is null or NaN reset back to 0
let themeid;
tempcookie = getCookie("themeid");
if (
	tempcookie == null ||
	tempcookie == "NaN" ||
	tempcookie > 1 ||
	tempcookie < 0
) {
	setCookie("themeid", 0, 364);
	setCookie("expirationTheme", 1, 364);
	themeid = 0;
} else {
	themeid = parseInt(tempcookie);
}

// Append dark theme css
if (themeid == 1) {
	const darkbg = Object.assign(document.createElement("style"), {
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
window.onload = () => {
	insert();
	document.documentElement.style.visibility = "";
	insertAfter();
};
