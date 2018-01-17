var fs = require('fs'),
    pth = require('path')

function list_headers(path) {
    var result = [];
    if (fs.exists(path)) console.error('The specified path '+path+' not found.');
    else {
        var files = fs.readdirSync(path);
        files.forEach(f => {
            if (fs.statSync(path + '/' + f).isFile() && pth.join(path, f).endsWith('.cpp'))
            console.log(path + '/' + f);
        });
    }
}

var walkSync = function (dir, filelist) {
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(file => {
        if (fs.statSync(dir + '/' + file).isDirectory())
            filelist = walkSync(dir + '/' + file, filelist);
        else
            filelist.push(file);
    });
    return filelist;
};

list_headers('/home/taran/Desktop/moz/mm/SpiderMonkey/js/src');