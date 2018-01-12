var crypt   = require('bcrypt-nodejs');
function generate_hash(val){
   return crypt.hashSync(val, crypt.genSaltSync(8), null);
   console.log("\n".crypt.hashSync(val, crypt.genSaltSync(8), null));
}

function compare_hash(hash,val){
  return crypt.compareSync(val, hash);
  console.log(val+"\n"+hash);
}
var exports = {"hash":generate_hash,"compHash":compare_hash}
module.exports = exports;