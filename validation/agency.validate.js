const Joi = require('joi');

const addressSchema = {
    address1: Joi.string().trim().min(5).max(100).required(),
    address2: Joi.string().trim().min(5).max(100).allow(),
    city: Joi.string().trim().min(2).max(20).required(),
    state: Joi.string().trim().min(2).max(20).required(),
    phoneNumber: Joi.string().length(10).pattern(/[6-9]{1}[0-9]{9}/).required()
        .error(new Error('Provide Correct Mobile Number')),
}

const agencySchema = {
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().trim().alter({
        POST: (schema) => schema.required(),
        PUT: (schema) => schema.forbidden(),
        PATCH: (schema) => schema.forbidden(),
    }),
    password: Joi.string().min(5).max(25).alter({
        POST: (schema) => schema.required(),
        PUT: (schema) => schema.forbidden(),
        PATCH: (schema) => schema.forbidden(),
    }),

    address: Joi.object().keys(addressSchema).required(),
}

const clientSchema = {
    agencyId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow()
        .error(new Error('Provide Correct  id')),
    name: Joi.string().min(2).max(50).alter({
        POST: (schema) => schema.required(),
        PATCH: (schema) => schema.allow(),
    }),

    email: Joi.string().email().trim().alter({
        POST: (schema) => schema.required(),
        PATCH: (schema) => schema.allow(),
    }),
    phoneNumber: Joi.string().length(10).pattern(/[6-9]{1}[0-9]{9}/).alter({
        POST: (schema) => schema.required(),
        PATCH: (schema) => schema.allow(),
    })
        .error(new Error('Provide Correct Mobile Number')),

    totalBill: Joi.number().alter({
        POST: (schema) => schema.required(),
        PATCH: (schema) => schema.allow(),
    }),

}


const validateAgency = async (body, requestType) => {

    const schema = Joi.object({
        agency: Joi.object().keys(agencySchema),
        client: Joi.object().keys(clientSchema),

    })
    return schema.tailor(requestType).validate(body);
}


const validateClient = async (body) => {
    const schema = Joi.object().keys(clientSchema)
    return schema.validate(body);
}




module.exports = { validateAgency, validateClient }