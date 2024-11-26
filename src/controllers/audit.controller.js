import {Audit} from "../models/audit.model.js"
import errResponse from "../utils/errResponse.js"
import sucResponse from "../utils/sucResponse.js"

// Get all audit logs
export const getAuditLogs = async (req,res,next) => {
    try {
        
        const auditLogs = await Audit.find()

        if(!auditLogs){
            throw new errResponse(404, "No audit logs found")
        }

        return res.json(new sucResponse(true, 200, "Logs Fetched Success" ,auditLogs))

    } catch (error) {
        next(error)
    }
}