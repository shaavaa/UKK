import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export const verifyTokenManajer = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const header = request.headers.authorization

        if(header) {
            let [key,token] = header.split(" ")
            const secret = process.env.JWT_SECRET_MANAJER || ""
            if(verify(token, secret)) {
                return next()
            }
        }

        return response
        .json({
            status: false,
            message: `Unauthorized. Please include verified token`
        }).status(401)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            }).status(400)
    }
}

export const verifyTokenKasir = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const header = request.headers.authorization

        if(header) {
            let [key,token] = header.split(" ")
            const secret = process.env.JWT_SECRET_KASIR || ""
            if(verify(token, secret)) {
                return next()
            }
        }

        return response
        .json({
            status: false,
            message: `Unauthorized. Please include verified token`
        }).status(401)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            }).status(400)
    }
}

export const verifyTokenAdmin = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const header = request.headers.authorization

        if(header) {
            let [key,token] = header.split(" ")
            const secret = process.env.JWT_SECRET_ADMIN || ""
            if(verify(token, secret)) {
                return next()
            }
        }

        return response
        .json({
            status: false,
            message: `Unauthorized. Please include verified token`
        }).status(401)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            }).status(400)
    }
}