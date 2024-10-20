import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import md5 from "md5";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getUser = async (request: Request, response: Response) => {
    try {
        const { search } = request.query

        const allUser = await prisma.user.findMany({
            where: {
                nama_user: { contains: search?.toString() || "" },
                username: { contains: search?.toString() || "" }
            }
        })

        return response
            .json({
                status: true,
                data: allUser,
                message: `Admin has been loaded`
            }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            }).status(400)
    }
}

export const postUser = async (request: Request, response: Response) => {
    try {
        const { nama_user, role, username, password } = request.body

        const newUser = await prisma.user.create({
            data: {
                nama_user, role, username, password: md5(password)
            }
        })

        return response
            .json({
                status: true,
                data: newUser,
                message: `Admin has been created`
            }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            }).status(400)
    }
}

export const putUser = async (request: Request, response: Response) => {
    try {
        const { id_user } = request.params

        const { nama_user, role, username, password } = request.body

        const findUser = await prisma.user.findFirst({
            where: { id_user: Number(id_user) }
        })

        if (!findUser)
            return response
                .json({
                    status: false,
                    message: `User not found`
                }).status(200)

        const updateUser = await prisma.user.update({
            where: { id_user: Number(id_user) },
            data: {
                nama_user: nama_user || findUser.nama_user,
                role: role || findUser.role,
                username: username || findUser.username,
                password: password ? md5(password) : findUser.password
            }
        })

        return response
            .json({
                status: true,
                data: updateUser,
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

export const delUser = async (request: Request, response: Response) => {
    try {
        const { id_user } = request.params

        const findUser = await prisma.user.findFirst({
            where: { id_user: Number(id_user) }
        })

        if (!findUser)
            return response
                .json({
                    status: false,
                    message: `User not found`
                }).status(200)

        const deleteUser = await prisma.user.delete({
            where: { id_user: Number(id_user) }
        })

        return response
            .json({
                status: true,
                data: deleteUser,
                message: `User has been delete`
            }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            }).status(400)
    }
}

export const loginKasir = async (request: Request, response: Response) => {
    try {
        const { username, password } = request.body

        const findUser = await prisma.user.findFirst({
            where: { username, password: md5(password) }
        })

        if (!findUser)
            return response
                .json({
                    status: false,
                    logged: false,
                    message: `Email or password is invalid`
                }).status(200)

        if (findUser.role !== "kasir")
            return response
                .json({
                    status: false,
                    logged: false,
                    message: `Access denied. Only kasir can login.`
                }).status(403)

        let payload = JSON.stringify(findUser)

        let secretkey = process.env.JWT_SECRET_KASIR

        let token = sign(payload, secretkey || "lidya")

        return response
            .json({
                status: true,
                logged: true,
                data: findUser,
                message: `Login success`,
                token
            }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            }).status(400)
    }
}

export const loginManajer = async (request: Request, response: Response) => {
    try {
        const { username, password } = request.body

        const findUser = await prisma.user.findFirst({
            where: { username, password: md5(password) }
        })

        if (!findUser)
            return response
                .json({
                    status: false,
                    logged: false,
                    message: `Email or password is invalid`
                }).status(200)

        if (findUser.role !== "manajer")
            return response
                .json({
                    status: false,
                    logged: false,
                    message: `Access denied. Only manajer can login.`
                }).status(403)

        let payload = JSON.stringify(findUser)

        let secretkey = process.env.JWT_SECRET_MANAJER

        let token = sign(payload, secretkey || "shava")

        return response
            .json({
                status: true,
                logged: true,
                data: findUser,
                message: `Login success`,
                token
            }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            }).status(400)
    }
}

export const loginAdmin = async (request: Request, response: Response) => {
    try {
        const { username, password } = request.body

        const findUser = await prisma.user.findFirst({
            where: { username, password: md5(password) }
        })

        if (!findUser)
            return response
                .json({
                    status: false,
                    logged: false,
                    message: `Email or password is invalid`
                }).status(200)

        if (findUser.role !== "admin")
            return response
                .json({
                    status: false,
                    logged: false,
                    message: `Access denied. Only admin can login.`
                }).status(403)

        let payload = JSON.stringify(findUser)

        let secretkey = process.env.JWT_SECRET_ADMIN

        let token = sign(payload, secretkey || "darrel")

        return response
            .json({
                status: true,
                logged: true,
                data: findUser,
                message: `Login success`,
                token
            }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            }).status(400)
    }
}