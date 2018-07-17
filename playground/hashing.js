const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = '123abc!';
// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     });
// });

const hashedPassword = '$2a$10$as61s8JySCy2GwYCf5oPO.L0wESZVSTy0N/RmBeq6LfPHVJ/s/TyS';
bcrypt.compare(password, hashedPassword, (err, result) => {
    console.log(result);
});

// const data = {
//     id: 10
// };

// const salt = '234erd';
// const token = jwt.sign(data, salt);
// console.log('token: ', token);

// const decoded = jwt.verify(token, salt);
// console.log('decoded: ', decoded);

// const message = 'I am new user';
// const hash = SHA256(message).toString();

// console.log('message: ', message);
// console.log('hash: ', hash);

// const data = {
//     id: 4
// };

// const token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesalt').toString()
// };

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
// const resultHash = SHA256(JSON.stringify(token.data) + 'somesalt').toString();

// if (resultHash === token.hash) {
//     console.log('Data not changed');
// } else {
//     console.log('Data changed!');
// }
