import { Request, Response } from "express";
import { Jenis, PrismaClient } from "@prisma/client";
import fs from "fs"
import { BASE_URL } from "../global";

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getMenu = async (request: Request, response: Response) => {
    try {
        const { search } = request.query

        const validJenis = Object.values(Jenis).find(jenis => jenis === search?.toString())

        const allMenu = await prisma.menu.findMany({
            where:
            {
                nama_menu: { contains: search?.toString() || "" },
                jenis: validJenis || undefined
            }
        })

        return response
            .json({
                status: true,
                data: allMenu,
                message: `Menu has been loaded`
            }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            }).status(400)
    }
}

export const postMenu = async (request: Request, response: Response) => {
    try {
        const { nama_menu, jenis, deskripsi, harga } = request.body

        let filename = ""
        if (request.file) filename = request.file.filename

        const newMenu = await prisma.menu.create({
            data: {
                nama_menu, jenis, deskripsi, gambar: filename, harga: Number(harga)
            }
        })

        return response
            .json({
                status: true,
                data: newMenu,
                message: `Menu has been created`
            }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            }).status(400)
    }
}

export const putMenu = async (request: Request, response: Response) => {
    try {
        const { id_menu } = request.params

        const { nama_menu, jenis, deskripsi, harga } = request.body

        const findMenu = await prisma.menu.findFirst({
            where: { id_menu: Number(id_menu) }
        })

        if (!findMenu)
            return response
                .json({
                    status: false,
                    message: `Menu not found`
                }).status(200)

        let filename = findMenu.gambar

        if (request.file) {
            filename = request.file.filename
            let path = `${BASE_URL}/public/cafe-image/${findMenu.gambar}`
            let exists = fs.existsSync(path)
            if (exists && findMenu.gambar !== ``) fs.unlinkSync(path)
        }

        const updateMenu = await prisma.menu.update({
            where: { id_menu: Number(id_menu) },
            data: {
                nama_menu: nama_menu || findMenu.nama_menu,
                jenis: jenis || findMenu.jenis,
                deskripsi: deskripsi || findMenu.deskripsi,
                gambar: filename,
                harga: harga ? Number(harga) : findMenu.harga
            }
        })

        return response
            .json({
                status: true,
                data: updateMenu,
                message: `Menu has been update`
            }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            }).status(400)
    }
}

export const delMenu = async (request: Request, response: Response) => {
    try {
        const { id_menu } = request.params

        const findMenu = await prisma.menu.findFirst({
            where: { id_menu: Number(id_menu) }
        })

        if (!findMenu)
            return response
                .json({
                    status: false,
                    message: `Menu not found`
                }).status(200)

                let path = `${BASE_URL}/public/cafe-image/${findMenu.gambar}`
                let exists = fs.existsSync(path)
                if (exists && findMenu.gambar !== ``) fs.unlinkSync(path)

        const deleteMenu = await prisma.menu.delete({
            where: { id_menu: Number(id_menu) }
        })

        return response
            .json({
                status: true,
                data: deleteMenu,
                message: `Menu has been delete`
            }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            }).status(400)
    }
}