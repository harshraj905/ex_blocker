document.addEventListener("DOMContentLoaded", () => {
    const originalInput = document.getElementById("original");
    const replacementInput = document.getElementById("replacement");
    const addButton = document.getElementById("add");
    const list = document.getElementById("list");
    const resetButton = document.getElementById("reset"); 

    function loadList() {
        chrome.storage.sync.get("blockedWords", data => {
            list.innerHTML = "";
            const words = data.blockedWords || {};
            Object.keys(words).forEach(original => {
                let li = document.createElement("li");
                li.textContent = `${original} → ${words[original]}`;
                list.appendChild(li);
            });
        });
    }

    addButton.addEventListener("click", () => {
        const original = originalInput.value.trim();
        const replacement = replacementInput.value.trim();
        if (original && replacement) {
            chrome.storage.sync.get("blockedWords", data => {
                const words = data.blockedWords || {};
                words[original] = replacement;
                chrome.storage.sync.set({ blockedWords: words }, loadList);
            });
        }
    });

    // ✅ Move reset button event inside DOMContentLoaded
    resetButton.addEventListener("click", function() {
        chrome.storage.sync.clear(() => {
            alert("All replacements removed!");
            chrome.runtime.reload(); // Reload extension to apply changes
        });
    });

    loadList();
});
