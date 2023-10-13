const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }
}, { timestamps: true });

// userSchema.pre('validate', function(next) {
//     console.log('called');
//     if(this.isModified('password'))
//         this.password = bcrypt.hashSync(this.password, 10);
//     next();
// })

userSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
}

module.exports = mongoose.model('User', userSchema);