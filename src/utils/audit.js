import {Audit} from "../models/audit.model.js"

export const createLog = async(action,user,target)=>{

    try {
        
        if (!action || !user || !target) {
            return false;
        }
      
        const audit = await Audit.create({
            action,
            user,
            target
        })

        await audit.save()

        return true

    } catch (error) {
        console.log(error)
        return false
    }

}