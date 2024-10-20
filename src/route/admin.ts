import express from "express";
import { getUser, postUser, putUser, delUser, loginAdmin } from "../controller/user";
import { verifyAddUser, verifyAuth, verifyUpdateUser } from "../middleware/user";
import { verifyTokenAdmin } from "../middleware/auth";
import { delMenu, getMenu, postMenu, putMenu } from "../controller/menu";
import { verifyAddMenu, verifyEditMenu } from "../middleware/menu";
import { delMeja, getMeja, postMeja, putMeja } from "../controller/meja";
import { verifyAddMeja, verifyEditMeja } from "../middleware/meja";
import { uploadFile } from "../middleware/uploadImage";

const app = express()

app.use(express.json())

app.post(`/admin/auth`, verifyAuth, loginAdmin)
// Mengelola data user
app.get(`/admin/user`, [verifyTokenAdmin], getUser)
app.post(`/admin/user`, [verifyTokenAdmin, verifyAddUser], postUser)
app.put(`/admin/user/:id_user`, [verifyTokenAdmin, verifyUpdateUser], putUser)
app.delete(`/admin/user/:id_user`, [verifyTokenAdmin], delUser)
// Mengelola data menu
app.get(`/admin/menu`, [verifyTokenAdmin], getMenu)
app.post(`/admin/menu`, [verifyTokenAdmin, uploadFile.single("gambar"), verifyAddMenu], postMenu)
app.put(`/admin/menu/:id_menu`, [verifyTokenAdmin, uploadFile.single("gambar"), verifyEditMenu], putMenu)
app.delete(`/admin/menu/:id_menu`, [verifyTokenAdmin], delMenu)
// Mengelola data meja
app.get(`/admin/meja`, [verifyTokenAdmin], getMeja)
app.post(`/admin/meja`, [verifyTokenAdmin, verifyAddMeja], postMeja)
app.put(`/admin/meja/:id_meja`, [verifyTokenAdmin, verifyEditMeja], putMeja)
app.delete(`/admin/meja/:id_meja`, [verifyTokenAdmin], delMeja)

export default app;