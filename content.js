function replaceText(node, blockedWords) {
    if (node.nodeType === Node.TEXT_NODE) {
        let text = node.nodeValue;
        Object.keys(blockedWords).forEach(original => {
            let regex = new RegExp(original, "gi");
            text = text.replace(regex, blockedWords[original]);
        });
        node.nodeValue = text;
    } else {
        node.childNodes.forEach(child => replaceText(child, blockedWords));
    }
}

function observeChanges(blockedWords) {
    const observer = new MutationObserver(() => {
        replaceText(document.body, blockedWords);
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

chrome.storage.sync.get("blockedWords", data => {
    if (data.blockedWords) {
        replaceText(document.body, data.blockedWords);
        observeChanges(data.blockedWords);
    }
});
