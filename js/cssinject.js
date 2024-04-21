// Cookie functions
const setCookie = (name, value, days) => {
	const expires = `; expires=${new Date(
		Date.now() + days * 864e5
	).toUTCString()}`;
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

// Switch between 0 and 1 function
// 0 - Light; 1 - Dark
const switchTheme = () => {
	themeid = (themeid + 1) % 2;
	setCookie("themeid", themeid, 364);
	location.reload();
};

// Insert features function
function insert() {
	try {
		// Append theme switch
		document.querySelector(".py-2").appendChild(thswitch);

		// Append credit
		document
			.getElementsByClassName(
				"d-flex align-items-center text-muted icms-links-inherit-color"
			)[0]
			.append(credit);
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
	link.href = chrome.runtime.getURL("css/dark.css");
	var checkhead = setInterval(() => {
		if (document.head) {
			clearInterval(checkhead);
			document.head.appendChild(link);
		}
	}, 1);
}

// Hide the page until it is fully loaded
document.documentElement.style.visibility = "hidden";

// Spectrum credit at the bottom
let credit = document.createElement("a");
credit.href = "https://github.com/Alextimka/Spectrum";
credit.target = "_blank";
credit.innerHTML = "Spectrum";
credit.title = chrome.i18n.getMessage("creditTitle");

// Theme switch svg
const themeSvg = document.createElement("img");
themeSvg.src = chrome.runtime.getURL(
	`icons/${themeid == 1 ? "dark" : "light"}.svg`
);

// Theme switch
const thswitch = document.createElement("a");
thswitch.classList.add("text-light", "ml-2");
thswitch.append(themeSvg);
thswitch.addEventListener("click", switchTheme);

// Show the page when it is fully loaded and append features
document.addEventListener("DOMContentLoaded", function () {
	setTimeout(() => {
		insert();
		document.documentElement.style.visibility = "";
	}, 150);
});
