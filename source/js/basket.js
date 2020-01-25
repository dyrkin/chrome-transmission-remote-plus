
function addTorrent(file) {
  var dirs = (localStorage.dLocation === 'dlcustom') ? JSON.parse(localStorage.dirs) : [];

  parseTorrent(file, function (torrent) {
    if (torrent !== null) {
      browser.windows.create({url: 'downloadTorrent.html', type: 'popup', width: 852, height: 583}, function (w) {
        encodeFile(file, function (data) {
          browser.tabs.sendMessage(w.tabs[0].id, {torrent: torrent, data: data, dirs: dirs});
        });
      });
    } else {
      alert('This isn\'t a torrent file.');
    }
  });
}

function drop(e) {
  var files = e.dataTransfer.files;

  if (files.length > 5) {
    alert('Select no more than 5 files!');
  } else {
    for (let i = 0, file; file = files[i]; ++i) {
      if (file.fileSize > 200000) {
        alert('File too large! Are you sure it\'s a torrent?');
        continue;
      }

      addTorrent(file);
    }
  }

  e.stopPropagation();
  e.preventDefault();
}

function discard(e) {
  e.stopPropagation();
  e.preventDefault();
}

(function () {
  var dropbox = jQuery('#dropbox');

  window.onUnload = function () {
    browser.browserAction.setBadgeText({text: ''});
  };

  dropbox.addEventListener('dragenter', discard, false);
  dropbox.addEventListener('dragover', discard, false);
  dropbox.addEventListener('drop', drop, false);

  dropbox.addEventListener('click', function () {
    jQuery('#hFile').click();
  }, false);
}());
