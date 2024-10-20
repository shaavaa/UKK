import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: 'pretty' })

export const getMeja = async (request: Request, response: Response) => {
    try {
        const allMeja = await prisma.meja.findMany()

        return response
            .json({
                status: true,
                data: allMeja,
                message: `Meja has been loaded`
            }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            }).status(400)
    }
}

export const postMeja = async (request: Request, response: Response) => {
    try {
        const { no_meja } = request.body

        const findMeja = await prisma.meja.findFirst({
            where: { no_meja: no_meja }
        })

        if (findMeja)
            return response
                .json({
                    status: false,
                    message: `Meja is avaible`
                }).status(200)

        const newMeja = await prisma.meja.create({
            data: {
                no_meja: no_meja
            }
        })

        return response
            .json({
                status: true,
                data: newMeja,
                message: `Meja has been created`
            }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            }).status(400)
    }
}

export const putMeja = async (request: Request, response: Response) => {
    try {
        const { id_meja } = request.params

        const { no_meja } = request.body

        const findmeja = await prisma.meja.findFirst({
            where: { id_meja: Number(id_meja) }
        })

        if (!findmeja)
            return response
                .json({
                    status: false,
                    message: `Meja not found`
                }).status(200)

        const findMeja = await prisma.meja.findFirst({
            where: { no_meja: no_meja }
        })

        if (findMeja)
            return response
                .json({
                    status: false,
                    message: `Meja is avaible`
                }).status(200)
                
        const updateMeja = await prisma.meja.update({
            where: { id_meja: Number(id_meja) },
            data: {
                no_meja: no_meja || findmeja.no_meja
            }
        })

        return response
            .json({
                status: true,
                data: updateMeja,
                message: `User has been update`
            }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            }).status(400)
    }
}

export const delMeja = async (request: Request, response: Response) => {
    try {
        const { id_meja } = request.params

        const findMeja = await prisma.meja.findFirst({
            where: { id_meja: Number(id_meja) }
        })

        if (!findMeja)
            return response
                .json({
                    status: false,
                    message: `Meja is not found`
                }).status(200)

        const deleteMeja = await prisma.meja.delete({
            where: { id_meja: Number(id_meja) }
        })

        return response
            .json({
                status: true,
                data: deleteMeja,
                message: `Meja has been delete`
            }).status(400)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            }).status(400)
    }
}