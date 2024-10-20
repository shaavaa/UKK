import express from "express";
import { verifyAuth } from "../middleware/user";
import { loginManajer } from "../controller/user";
import { verifyTokenManajer } from "../middleware/auth";
import { getTransaksi, readTransaksi } from "../controller/transaksi";

const app = express()

app.use(express.json())

app.post(`/manajer/auth`, verifyAuth, loginManajer)
app.get(`/manajer/:id_user`, [verifyTokenManajer], readTransaksi)
app.get(`/manajer`, [verifyTokenManajer], getTransaksi)

export default app;