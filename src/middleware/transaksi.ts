import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const detailTransaksi = Joi.object({
    id_menu: Joi.number().required(),
    jumlah: Joi.number().min(1).required(),
    harga: Joi.number().min(1).required()
})

const addTransaksi = Joi.object({
    tgl_transaksi: Joi.date().required(),
    id_user: Joi.number().required(),
    id_meja: Joi.number().required(),
    nama_pelanggan: Joi.string().required(),
    status: Joi.string().required(),
    detail_transaksi: Joi.array().items(detailTransaksi).min(0).required()
})

export const verifyAddTransaksi = (request: Request, response: Response, next: NextFunction) => {
    const {error} = addTransaksi.validate(request.body, {abortEarly: false})

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