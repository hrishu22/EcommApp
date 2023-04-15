const fs = require('fs')
const crypto = require('crypto')
const util = require('util')


module.exports = class Repository{
    constructor(filename){
        if(!filename){
            throw new Error('Creating repository requires a filename');

        }
        this.filename=filename;
        try{
            fs.accessSync(this.filename)
        }
        catch(err){
            fs.writeFileSync(this.filename,'[]')
        }
    }
    async create(attrs){
        attrs.id= this.randomId();

        const records = await this.getAll()
        records.push(attrs)
        await this.writeAll(records)

        return attrs
    }
    async getAll(){
        // open the file called this.filename
            return JSON.parse(await fs.promises.readFile(this.filename,{
                encoding:'utf8'
            }))
            
        //read its contents
            // console.log(contents)

        // parse the content
            // const data = JSON.parse(contents)

        //return teh parsed data
        // return data
    }
    
   

    async writeAll(records){
        await fs.promises.writeFile(this.filename,
            JSON.stringify(records,null,2))
     
    }
    randomId(){
        return crypto.randomBytes(4).toString('hex')
    }

    async getOne(id){
        const records = await this.getAll();
        return records.find(record=>
            record.id===id);
        
    }
    async delete(id){
        const records = await this.getAll();
        const filtered =records.filter(record=>record.id!==id)
        await this.writeAll(filtered)
    }
    async update(id,attrs){
        const records = await this.getAll()
        const record = records.find(record=> record.id===id)
        if(!record){
            throw new Error(`Record with ${id} not found`)
        }
        Object.assign(record,attrs)
        await this.writeAll(records)

    }
    async getOneBy(filters){
        const records = await this.getAll()

        for(let record of records){
            let found = true;
            for(let key in filters){
                if(record[key]!=filters[key]){
                    found=false;
                }
            }
            if(found){
                return record;
            } 
        }
    }
}