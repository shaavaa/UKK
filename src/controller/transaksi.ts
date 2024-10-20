import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import pdf from 'html-pdf';
import { format } from "path";

const prisma = new PrismaClient({ errorFormat: "pretty" })

export const getTransaksi = async (request: Request, response: Response) => {
    try {
        const { search, startDate, endDate } = request.query

        const allTransaksi = await prisma.transaksi.findMany({
            where: {
                AND: [
                    { nama_pelanggan: { contains: search?.toString() || "" } },
                    {
                        tgl_transaksi: {
                            gte: startDate ? new Date(startDate.toString()) : undefined,
                            lte: endDate ? new Date(endDate.toString()) : undefined
                        }
                    }
                ]
            },
            include: {
                detail_transaksi: { include: { menu_detail: true } },
                user_detail: true,
                meja_detail: true
            }
        })

        return response
            .json({
                status: true,
                data: allTransaksi,
                message: `Transaksi has been loaded`
            })
    } catch (error) {
        return response.json({
            status: false,
            message: `There is an error.${error}`
        }).status(400)
    }
}

export const postTransaksi = async (request: Request, response: Response) => {
    try {
        const { id_user, id_meja, nama_pelanggan, status, detail_transaksi } = request.body

        const tgl_transaksi = new Date(request.body.tgl_transaksi).toISOString();

        const newTransaksi = await prisma.transaksi.create({
            data: { tgl_transaksi, id_user, id_meja, nama_pelanggan, status }
        })

        for (let index = 0; index < detail_transaksi.length; index++) {
            const { id_menu, jumlah, harga } = detail_transaksi[index]

            await prisma.detail_transaksi.create({
                data: {
                    id_transaksi: newTransaksi.id_transaksi,
                    id_menu: Number(id_menu),
                    jumlah: Number(jumlah),
                    harga: Number(harga)
                }
            })
        }

        return response
            .json({
                status: true,
                data: newTransaksi,
                message: `New transaksi has been create`
            })
    } catch (error) {
        return response.json({
            status: false,
            message: `There is an error.${error}`
        }).status(400)
    }
}

export const delTransaksi = async (request: Request, response: Response) => {
    try {
        const { id_transaksi } = request.params

        const findTransaksi = await prisma.transaksi.findFirst({
            where: { id_transaksi: Number(id_transaksi) }
        })

        if (!findTransaksi)
            return response
                .status(200)
                .json({
                    status: false,
                    message: `Transaksi is not found`
                })

        let deleteTransaksi = await prisma.transaksi.delete({ where: { id_transaksi: Number(id_transaksi) } })

        return response
            .json({
                status: true,
                data: deleteTransaksi,
                message: `Transaksi has been delete`
            }).status(200)
    } catch (error) {
        return response.json({
            status: false,
            message: `There is an error.${error}`
        }).status(400)
    }
}

export const readTransaksi = async (request: Request, response: Response) => {
    try {
        const { id_user } = request.params


        const Transaksi = await prisma.transaksi.findFirst({
            where: {
                id_user: Number(id_user)
            },
            include: {
                user_detail: true,
                meja_detail: true,
                detail_transaksi: { include: { menu_detail: true } },
            }
        })
        if (!Transaksi)
            return response
                .json({
                    status: false,
                    message: `Transaksi by user is not found`
                }).status(200)

        return response
            .json({
                status: true,
                data: Transaksi,
                message: `Transaksi by user has been loaded`
            })
    } catch (error) {
        return response.json({
            status: false,
            message: `There is an error.${error}`
        }).status(400)
    }
}

export const cetakNota = async (request: Request, response: Response) => {
    const { id_transaksi } = request.params; // Ambil id_transaksi dari parameter

    try {
        // Ambil data transaksi berdasarkan id_transaksi
        const transaksi = await prisma.transaksi.findUnique({
            where: { id_transaksi: Number(id_transaksi) },
            include: {
                detail_transaksi: { include: { menu_detail: true } },
                user_detail: true,
                meja_detail: true
            }
        });

        if (!transaksi) {
            return response.status(404).json({
                status: false,
                message: `Transaksi tidak ditemukan`
            });
        }

        const htmlTemplate = `
    <html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 20px;
            background-color: #f9f9f9;
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 20px;
        }
        p {
            font-size: 14px;
            color: #555;
            margin: 5px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th, td {
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #4CAF50;
            color: white;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        tr:hover {
            background-color: #ddd;
        }
        .total {
            font-weight: bold;
            font-size: 16px;
            margin-top: 20px;
            text-align: right;
        }
    </style>
</head>
<body>
    <h1>Nota Pembelian</h1>
    <p>Order ID: ${transaksi.id_transaksi}</p>
    <p>Tanggal: ${transaksi.tgl_transaksi}</p>
    <p>Nama Pelanggan: ${transaksi.user_detail.nama_user}</p>
    <p>No Meja: ${transaksi.meja_detail.no_meja}</p>
    <table>
        <thead>
            <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Sub Total</th>
            </tr>
        </thead>
        <tbody>
            ${transaksi.detail_transaksi.map(detail => `
                <tr>
                    <td>${detail.menu_detail.nama_menu}</td>
                    <td>Rp${detail.harga}</td>
                    <td>${detail.jumlah}</td>
                    <td>Rp${detail.harga*detail.jumlah}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    <p class="total">Total: Rp${transaksi.detail_transaksi.reduce((total, detail) => total + (detail.harga * detail.jumlah), 0)}</p>
</body>
</html>

    `;

    const options: pdf.CreateOptions = {format: 'A4'};
    pdf.create(htmlTemplate, options).toStream((err, stream) => {
        if (err) {
            return response.status(500).json({
                status: false,
                message: `Error generating PDF: ${err}`,
            });
        }
        response.setHeader("Content-Type", "application/pdf");
        stream.pipe(response);
    });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: `There is an error: ${error}`
        })
    };
};