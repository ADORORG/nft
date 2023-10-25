
onmessage = function (e) {
    let file = e.data.file;
    let readAs = e.data.readAs; // "readAsDataURL" | "readAsArrayBuffer"
    let reader = new FileReader();
    
    reader.onload = function (e) {
        postMessage(e.target.result);
    };

    if (readAs === "readAsArrayBuffer") {
        reader.readAsArrayBuffer(file);
    } else {
        reader.readAsDataURL(file);
    }
}