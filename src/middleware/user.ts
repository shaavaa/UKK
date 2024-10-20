import { role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const addUser = Joi.object({
    nama_user: Joi.string().required(),
    role: Joi.string().valid('admin', 'kasir', 'manajer').required(),
    username: Joi.string().required(),
    password: Joi.string().required()
})

const updateUser = Joi.object({
    nama_user: Joi.string().optional(),
    role: Joi.string().valid('admin', 'kasir', 'manajer').optional(),
    username: Joi.string().optional(),
    password: Joi.string().optional()
})

const auth = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})


export const verifyAddUser = (request: Request, response: Response, next: NextFunction) =>{
    const {error} = addUser.validate(request.body, {abortEarly: false})

    if(error) {
        return response
        .json({
            status: false,
            message: error.details.map(it=> it.message).join()
        }).status(400)
    }
    return next()
}

export const verifyUpdateUser = (request: Request, response: Response, next: NextFunction) =>{
    const {error} = updateUser.validate(request.body, {abortEarly: false})

    if(error) {
        return response
        .json({
            status: false,
            message: error.details.map(it=> it.message).join()
        }).status(400)
    }
    return next()
}

export const verifyAuth = (request: Request, response: Response, next: NextFunction) =>{
    const {error} = auth.validate(request.body, {abortEarly: false})

    if(error) {
        return response
        .json({
            status: false,
            message: error.details.map(it=> it.message).join()
        }).status(400)
    }
    return next()
}