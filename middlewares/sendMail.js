import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'jyantithakor941@gmail.com',
        pass:'uxieoshjqyouzyxa'
    }
})

export default transporter;