export function download(data, filename) {
    let tempLink = document.createElement("a"); // create temporary hyperlink element
    tempLink.setAttribute("href", "data:text/plain;base64," + btoa(data)); // set uri
    tempLink.setAttribute("download", filename); // add download attribute
    tempLink.style.display = "none"; // make sure element does not display

    document.body.appendChild(tempLink);

    tempLink.click(); // simulate click

    document.body.removeChild(tempLink);
}