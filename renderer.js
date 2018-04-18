// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const fs = require('fs');
const waitingList = [];
const resultList = [];
const os = require('os');
function addPath(path) {
  waitingList.push(path);
}

function deletePath(path) {
  if(waitingList.length < 1) return;
  if(waitingList.indexOf(path) < 0) return;
  let index = waitingList.indexOf(path);
  waitingList.splice(index, 1);
}

function transformPath(path) {
  if(path === null || path.length < 1) return;
  let delimiter = '';
  if(os.type() === "Windows_NT") {
    delimiter = '\\';
  }
  const splitedPath = path.split(delimiter);
  console.log(splitedPath);
}

function test() {
  lis = document.querySelectorAll("li");
  for(let li of lis) {
    const path = li.textContent;
    const resPath = transformPath(path);
  }
}

const testButton = document.getElementById("upload");
testButton.addEventListener('click', test);

document.addEventListener('drop', function (e) {
  e.preventDefault();
  e.stopPropagation();
  document.querySelector('form p').textContent = e.dataTransfer.files.length + " file(s) selected";
  for (let f of e.dataTransfer.files) {
    const fileli = document.createElement('li');
    fileli.textContent = f.path;
    document.getElementById('results').appendChild(fileli);
    console.log('File(s) you dragged here: ', f.path);
  }
});

document.addEventListener('dragover', function (e) {
  e.preventDefault();
  e.stopPropagation();
});

document.querySelector('form').addEventListener("change", function(e) {
  e.preventDefault();
  e.stopPropagation();
  console.log(e);
  document.querySelector('form p').textContent = e.target.files.length + " file(s) selected";
  for (let f of e.target.files) {
    console.log('File(s) you dragged here: ', f.path)
  }
})