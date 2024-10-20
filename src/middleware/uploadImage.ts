import { Request } from "express";
import multer from "multer";
import { BASE_URL } from "../global";

const storage = multer.diskStorage({
   destination: (request: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
       cb(null, `${BASE_URL}/public/cafe-image`)
   },
   filename: (request: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
       cb(null, `${new Date().getTime().toString()}-${file.originalname}`)
   }
})

export const uploadFile = multer({
   storage,
   limits : {fileSize: 2*1024*1024}
})