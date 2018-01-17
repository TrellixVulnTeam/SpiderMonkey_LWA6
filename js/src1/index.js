var fs = require('fs'),
    path = require('path');

function ls(dir, list) {
    if (fs.exists(dir)) console.error('The specified path ' + dir + ' not found.');
    else {
        list = list || { cpp: [], h: [] };
        /*fs.readdirSync(dir).forEach(f => {
            if (fs.statSync(dir + '/' + f).isFile()) {
                if (path.join(dir, f).endsWith('.cpp'))
                    list.cpp.push(path.join(dir, f));
                else if (path.join(dir, f).endsWith('.h'))
                    list.h.push(path.join(dir, f));
            }
            else if (fs.statSync(dir + '/' + f).isDirectory())
                list = ls(dir + '/' + f, list);
        });*/

        fs.readdirSync(dir).forEach(f => {
            if (fs.statSync(dir + '/' + f).isFile()
                && (path.join(dir, f).endsWith('.cpp')
                || path.join(dir, f).endsWith('.h')))
                list.cpp.push(path.join(dir, f));
            else if (fs.statSync(dir + '/' + f).isDirectory())
                list = ls(dir + '/' + f, list);
        });

        return list;
    }
}
// var files = ls('/home/taran/Desktop/moz/mm/SpiderMonkey/js/src', {cpp: [], h: []});
ls('/Users/tanmay/jsdotnet/SpiderMonkey/js/src', {cpp: [], h: []}).cpp.forEach(f => console.log(f));
// console.log('Header files...');
// ls('/Users/tanmay/jsdotnet/SpiderMonkey/js/src', {cpp: [], h: []}).h.forEach(f => console.log(f));