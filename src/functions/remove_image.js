let path = require('path');
let fs = require('fs');

function remove_image (name){
    const storage = path.resolve(__dirname, `../public${name}`);
    if(storage){
        fs.unlink(storage, (err) => { if (err) {return console.log(err);}});
    }else{
        return console.log("Could not find:__ "+name);
    }
};

module.exports = remove_image;
