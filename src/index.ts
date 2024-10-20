import express from "express";
import admin from './route/admin';
import kasir from './route/kasir';
import manajer from './route/manajer'

const app= express();
const PORT= 8000;

app.use(express.json())

app.use(admin)
app.use(kasir)
app.use(manajer)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})