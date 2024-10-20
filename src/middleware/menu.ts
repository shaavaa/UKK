import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const addMenu = Joi.object({
    nama_menu: Joi.string().required(),
    jenis: Joi.string().valid('makanan', 'minuman').required(),
    deskripsi: Joi.string().required(),
    gambar: Joi.allow().optional(),
    harga: Joi.number().min(1).required()
})

const updateMenu = Joi.object({
    nama_menu: Joi.string().optional(),
    jenis: Joi.string().valid('makanan', 'minuman').optional(),
    deskripsi: Joi.string().optional(),
    gambar: Joi.allow().optional(),
    harga: Joi.number().min(1).optional()
})

export const verifyAddMenu = (request: Request, response: Response, next: NextFunction) => {
    const {error} = addMenu.validate(request.body, {abortEarly: false})

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

export const verifyEditMenu = (request: Request, response: Response, next: NextFunction) => {
    const {error} = updateMenu.validate(request.body, {abortEarly: false})

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