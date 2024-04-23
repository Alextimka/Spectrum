// Check the browser
if (typeof browser === "undefined") {
	var browser = chrome;
}

// Cookie functions
function setCookie(name, value, days) {
	const expires = `; expires=${new Date(
		Date.now() + days * 864e5
	).toUTCString()}`;
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
		// Check if a newer version is available
		if (currVer < (await latest())) {
			credText += `%20(${browser.i18n.getMessage("creditImg")})`;
		}
		creditImg.src = `https://img.shields.io/badge/Spectrum%20v${credText}-4d4d4d?logo=github`;

		// Append credit
		credit.append(creditImg);
		document
			.getElementsByClassName(
				"d-flex align-items-center text-muted icms-links-inherit-color"
			)[0]
			.append(credit);
		if(icms.neomessenger.currentUser.id == 45) {
			document.getElementsByClassName("icms-user-avatar d-flex align-items-center")[0].firstElementChild.width = 32;
			document.getElementsByClassName("icms-user-avatar d-flex align-items-center")[0].firstElementChild.src = "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQh9cRZvd4lV9a-bPDB4jqBhliXbM8hZcoW-aSJwY5WG0P1UzKa";
		}
	} catch {}
}




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
	themeid = 0;
} else {
	themeid = parseInt(tempcookie);
}

// Append dark theme css
if (themeid == 1) {
	const link = document.createElement("link");
	link.type = "text/css";
	link.rel = "stylesheet";
	link.href = browser.runtime.getURL("css/dark.css");
	var checkhead = setInterval(() => {
		if (document.head) {
			clearInterval(checkhead);
			document.head.appendChild(link);
		}
	}, 1);
}

// Hide the page until it is fully loaded
document.documentElement.style.visibility = "hidden";

// Theme switch svg
const themeSvg = document.createElement("img");
themeSvg.src = browser.runtime.getURL(
	`icons/${themeid == 1 ? "dark" : "light"}.svg`
);

// Theme switch
const thswitch = document.createElement("a");
thswitch.classList.add("text-light", "ml-2");
thswitch.append(themeSvg);
thswitch.addEventListener("click", switchTheme);

// Spectrum credit at the bottom
let credit = document.createElement("a");
credit.href = browser.i18n.getMessage("creditUrl");
credit.target = "_blank";
credit.title = browser.i18n.getMessage("creditTitle");

// Credit image
var credText = browser.runtime.getManifest().version;
const currVer = parseFloat(credText.substr(credText.length - 3));
const creditImg = document.createElement("img");

// Show the page when it is fully loaded and append features
document.addEventListener("DOMContentLoaded", function () {
	setTimeout(() => {
		insert();
		document.documentElement.style.visibility = "";
		insertAfter();
	}, 150);
});
