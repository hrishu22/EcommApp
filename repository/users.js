const fs = require('fs')
const crypto = require('crypto')
const util = require('util')
const Repository = require('./repository')

const scrypt = util.promisify(crypto.scrypt)

class UsersRepository extends Repository{
    
    async create(attrs){
        //attrs === user 
        // attrs ={'email':'email', 'password':'password'}
        attrs.id = this.randomId();
        const salt = crypto.randomBytes(8).toString('hex')
        const buf = await scrypt(attrs.password,salt,64)

        const records = await this.getAll();
        const record = {
            ...attrs,
            password:`${buf.toString('hex')}.${salt}`

        };
        records.push(record)
        await this.writeAll(records)
        return record
    }

    async comparePassword(saved,supplied){
        //saved = saved password in our database. 'hashed.salt'
        //supplied= user send for signin 

        // const result  = saved.split('.')
        // const hashed =result[0];
        // const salt = result[1];

        const [hashed, salt] = saved.split('.') //destructuring
        const hashedSupplied = await scrypt(supplied,salt,64);

        return (hashed===hashedSupplied.toString('hex'))


    }
}
 
module.exports = new  UsersRepository('users.json')


// const test = async ()=>{
//     const repo = new UsersRepository('users.json');
//     // await repo.create({email:'test@test.com',password:'password'})
//     // const users = await repo.getAll()
//     // const user = await repo.getOne('802e9e89')

//     const user = await repo.getOneBy({'password':'password'})
//     // await repo.delete('1fe24d5d')
//     // await repo.update('67f9efa',{'email':'hrishu@hrishu.com'})
//     // console.log(user)
// }
// test()  //helper function

