import express from "express";
import { verifyAuth } from "../middleware/user";
import { loginKasir } from "../controller/user";
import { verifyTokenKasir } from "../middleware/auth";
import { cetakNota, getTransaksi, postTransaksi } from "../controller/transaksi";

const app = express()

app.use(express.json())

app.post(`/kasir/auth`, verifyAuth, loginKasir)
app.post(`/kasir/transaksi`, [verifyTokenKasir], postTransaksi)
app.get(`/kasir/transaksi`, [verifyTokenKasir], getTransaksi)
app.get(`/kasir/cetaknota/:id_transaksi`, [verifyTokenKasir], cetakNota)

export default app;