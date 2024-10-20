import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const addMeja = Joi.object({
    no_meja: Joi.number().min(1).required()
})

const editMeja = Joi.object({
    no_meja: Joi.number().min(1).optional()
})

export const verifyAddMeja = (request: Request, response: Response, next: NextFunction) => {
    const {error} = addMeja.validate(request.body, {abortEarly: false})

    if (error) {
        return response
        .status(400)
        .json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}

export const verifyEditMeja = (request: Request, response: Response, next: NextFunction) => {
    const {error} = editMeja.validate(request.body, {abortEarly: false})

    if (error) {
        return response
        .status(400)
        .json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}