

//For the search areas, so you don't get fucked when looking something up.
function Skippable(node) {
    if (!node.parentNode) return false;

    let currentNode = node.parentNode;
    while (currentNode && currentNode.nodeType === Node.ELEMENT_NODE) {

        const tag = currentNode.tagName ? currentNode.tagName.toLowerCase() : '';
        if (['input', 'textarea', 'select', 'option'].includes(tag)) {
            return true;
        }


        const role = currentNode.hasAttribute('role') ? currentNode.getAttribute('role') : '';
        if (['textbox', 'searchbox', 'combobox', 'input'].includes(role)) {
            return true;
        }


        if (currentNode.hasAttribute('contenteditable')) {
            return true;
        }


        const testId = currentNode.hasAttribute('data-testid') ? currentNode.getAttribute('data-testid').toLowerCase() : '';
        if (testId.includes('input') || testId.includes('search')) {
            return true;
        }

        currentNode = currentNode.parentNode;
    }

    return false;
}

function replaceText(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        if (Skippable(node)) {
            return;
        }
        node.nodeValue = node.nodeValue.replace(/election/gi, 'erection');
    } else {
        for (let child of node.childNodes) {
            replaceText(child);
        }
    }
}


function initializeExtension() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    replaceText(node);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('Extension is running');
    replaceText(document.body);
}

if (document.body) {
    initializeExtension();
} else {
    document.addEventListener('DOMContentLoaded', initializeExtension);
}