function returnToViewer() {
    viewer.innerHTML = `
        <div id="savedfiles">
            <div id="file-icons"></div>
        </div>
        <span>Saved Files</span>
        <ul id="files"></ul>
    `;
    displaySavedFiles();
}

const createNewFileButton = document.getElementById('Creatnewfile');
const viewer = document.getElementById('viewer');

createNewFileButton.addEventListener('click', createNewFile);
createNewFileButton.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
        createNewFile();
    }
});

const loadButton = document.getElementById('load');
loadButton.addEventListener('click', loadFile);
loadButton.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
        loadFile();
    }
});

function loadFile(filename) {
    if (!filename) {
        filename = prompt('Enter the filename to load:');
    }
    if (filename) {
        const content = localStorage.getItem(filename);
        if (content) {
            viewer.innerHTML = `
                <textarea id="editor">${content}</textarea>
                <button id="saveFile">Save</button>
                <button id="deleteFile">Delete</button>
            `;
            document.getElementById('saveFile').addEventListener('click', () => saveFile(filename));
            document.getElementById('saveFile').addEventListener('keydown', (event) => {
                if (event.keyCode === 13) {
                    saveFile(filename);
                }
            });
            document.getElementById('deleteFile').addEventListener('click', () => deleteFile(filename));
            document.getElementById('deleteFile').addEventListener('keydown', (event) => {
                if (event.keyCode === 13) {
                    deleteFile(filename);
                }
            });
        } else {
            alert('File not found!');
        }
    }
}

function createNewFile() {
    viewer.innerHTML = "<input type='text' id='filename' placeholder='Enter filename' />";
    const filenameInput = document.getElementById('filename');
    filenameInput.addEventListener('blur', () => {
        const filename = filenameInput.value;
        viewer.innerHTML = `
            <textarea id="editor" placeholder="Enter file content"></textarea>
            <button id="saveFile">Save</button>
            <button id="deleteFile">Delete</button>
        `;
        const editor = document.getElementById('editor');
        editor.focus();
        document.getElementById('saveFile').addEventListener('click', () => saveFile(filename));
        document.getElementById('saveFile').addEventListener('keydown', (event) => {
            if (event.keyCode === 13) {
                saveFile(filename);
            }
        });
        document.getElementById('deleteFile').addEventListener('click', () => deleteFile(filename));
        document.getElementById('deleteFile').addEventListener('keydown', (event) => {
            if (event.keyCode === 13) {
                deleteFile(filename);
            }
        });
    });
    filenameInput.addEventListener('keydown', (event) => {
        if (event.keyCode === 13) {
            filenameInput.blur();
        }
    });
}

function saveFile(filename) {
    const editor = document.getElementById('editor');
    const content = editor.value;
    if (filename && content) {
        localStorage.setItem(filename, content);
        alert('File saved successfully!');
        returnToViewer();
    }
    location.reload();
}

function deleteFile(filename) {
    if (confirm(`Are you sure you want to delete the file "${filename}"?`)) {
        localStorage.removeItem(filename);
        alert('File deleted successfully!');
        returnToViewer();
    }
}

const savedFilesContainer = document.getElementById('file-icons');
const filesList = document.getElementById('files');

function displaySavedFiles() {
    savedFilesContainer.innerHTML = '';
    filesList.innerHTML = '';
    for (let i = 0; i < localStorage.length; i++) {
        const filename = localStorage.key(i);
        const content = localStorage.getItem(filename);
        const fileIcon = document.createElement('div');
        fileIcon.className = 'file-icon';
        fileIcon.innerHTML = `
            <strong>${filename}</strong>
            <p>${content.substring(0, 20)}...</p>
            <button onclick="loadFile('${filename}')">Edit</button>
            <button onclick="deleteFile('${filename}')">Delete</button>
        `;
        savedFilesContainer.appendChild(fileIcon);

        const fileListItem = document.createElement('li');
        fileListItem.textContent = filename;
        fileListItem.addEventListener('click', () => loadFile(filename));
        filesList.appendChild(fileListItem);
    }
}
window.onload = displaySavedFiles;