// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const fs = require('fs');
const os = require('os');
const swal = require('sweetalert');
const mkdirp = require('mkdirp');
let homeDir = os.homedir() + '/Desktop/';

// document.getElementById('saveTo').textContent = "Hotfix will be saved to " + homeDir;

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

function validateFile(path) {
  return path.endsWith('.class');
}
function transformPath(path) {
  if(path === null || path.length < 1) return;
  let delimiter = '';
  if(os.type() === "Windows_NT") {
    delimiter = '\\';
  }
  const newPath = path.replaceAll(delimiter,'/');
  console.log(newPath);
  return newPath;
}

function getFileName(path) {
  if(path === null || path.length < 1) return;
  let delimiter = '';
  if(os.type() === "Windows_NT") {
    delimiter = '\\';
  } else {
    delimiter = '/'
  }
  array = path.split(delimiter);
  return array[array.length - 1];
}

function generateDir(homeDir, classDir, filePath, fileName) {
  if(homeDir === null || homeDir === '') return;
  if(classDir === null || classDir === '') return;
  if(!homeDir.endsWith('/')) {
    homeDir += '/';
  }
  if(classDir.startsWith('/')) {
    classDir = classDir.slice(1);
  }
  let targetDir = homeDir + classDir;
  targetDir = targetDir.replace('classes','classes/hotfix');
  console.log(targetDir);
  mkdirp(targetDir, function(err) {
    if (err) {
      console.error(err);
    } else {
      console.log('dir created');
      if(!targetDir.endsWith('/')) {
        targetDir += '/';
      }
      const newFilePath = targetDir + fileName;
      console.log(newFilePath);
      fs.writeFileSync(newFilePath, fs.readFileSync(filePath));
    }
  });
}

function getClassPath(path) {
  if(path === null || path.length < 1) return;
  const index = path.indexOf('/classes/com');
  const lastIndex = path.lastIndexOf("/");
  return path.slice(index, lastIndex);
}

function main() {
  lis = document.querySelectorAll("li");
  if(lis.length < 1) {
    swal("","You need to select files before proceeding.","error");
    return;
  }
  for(let li of lis) {
    const path = li.textContent;
    const filePath = transformPath(path);
    const fileName = getFileName(path);
    const classPath = getClassPath(filePath);
    // console.log('classpath',classPath);
    generateDir(homeDir, classPath, filePath, fileName);
  }

  swal("","Hotfix is generated successfully","success");
}

document.addEventListener('drop', function (e) {
  e.preventDefault();
  e.stopPropagation();
  for (let f of e.dataTransfer.files) {
    const fileli = document.createElement('li');
    fileli.textContent = f.path;

    if(!validateFile(f.path)) {
      swal("","Please only select .class files","error");
      return;
    }

    var t = document.getElementsByTagName('li')
    // for(let existFilePath of t.path)
    for (var i = 0;i<t.length; i ++) {
      console.log(f.path + ':'+t[i].textContent)
      if(f.path === t[i].textContent){
        swal("",'file '+ f.path+ ' has existed!',"info")
        f.existflag = true
        break
      }
    } 
    if(!f.existflag) {
      var deleteButton = document.createElement("i");
    deleteButton.className = "fa fa-close deleteButton";
    //deleteButton.setAttribute("aria-hidden", "true");
    fileli.appendChild(deleteButton);
    //@get current li
    asyncGetLi(deleteButton).then(function(value) {
    }, function(err) {
    console.log(err);
    });
    // @set: deleteButton dom
 
    document.getElementById('results').appendChild(fileli);
    }
    
  }
  document.querySelector('form p').textContent = document.getElementById('results').children.length + " file(s) selected";
});

document.addEventListener('dragover', function (e) {
  e.preventDefault();
  e.stopPropagation();
});

document.querySelector('form').addEventListener("change", function(e) {
  e.preventDefault();
  e.stopPropagation();
  document.querySelector('form p').textContent = e.target.files.length + " file(s) selected";
  for (let f of e.target.files) {
    const fileli = document.createElement('li');
    fileli.textContent = f.path;
    if(!validateFile(f.path)) {
      swal("","Please only select .class files","error");
      return;
    }
    document.getElementById('results').appendChild(fileli);
  }
  document.querySelector('form p').textContent = document.getElementById('results').children.length + " file(s) selected";
})

const mainBtn = document.getElementById("mainBtn");
mainBtn.addEventListener('click', main);

// select home dir
const ipc = require('electron').ipcRenderer
const selectDirBtn = document.getElementById('select-file')

selectDirBtn.addEventListener('click', function (event) {
     ipc.send('open-file-dialog','ping')
});

//Getting back the information after selecting the file
ipc.on('selected-file', function (event, path) {
  //do what you want with the path/file selected, for example:
  console.log(path[0])
  const newPath = path[0].replace(/\\/g,'/')
  homeDir = newPath
  // document.getElementById('slected-file').innerHTML = `You selected: ${path[0]}`
  document.getElementById('slected-file').value = path[0]

}); 

// delete
function deleteDom(currentLi) {
  document.getElementById('results').removeChild(currentLi);
  }; 

  function asyncGetLi( deleteButton) {
    return new Promise(function(resolve, reject) {
    var currentLi = deleteButton.parentNode;
    deleteButton.addEventListener("click", function() {
    deleteDom( currentLi );
    }); 
    resolve(currentLi);
    });
    } 

    function asyncGetLi( deleteButton) {
      return new Promise(function(resolve, reject) {
      var currentLi = deleteButton.parentNode;
      deleteButton.addEventListener("click", function() {
        deleteDom( currentLi );
        document.querySelector('form p').textContent = document.getElementById('results').children.length + " file(s) selected";
      }); 
      resolve(currentLi);
      });
      } 
