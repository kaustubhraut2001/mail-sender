const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();


const url = process.env.URL;
async function scrapeData() {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // Use jQuery-like selectors to extract data
        // const title = $('h1').text();
        // const paragraphs = $('p').map((i, el) => $(el).text()).get();
        // const tabledata = $('table').map((el) => $(el).text()).get();
        const table = $('tbody');


        table.find('tr').each((i, row) => {
            const columns = $(row).find('td');


            const data = columns.map((i, col) => $(col).text()).get();
            // console.log(data);
            const dataArrays = [data];


            const concatenatedString = dataArrays.flat().map(str => str.trim()).join('');

            console.log(concatenatedString);

            fs.appendFileSync('data.txt', concatenatedString);
        })


        // console.log('Title:', title);
        // console.log('Paragraphs:', paragraphs);
        // console.log('Tabledata:', tabledata);
    } catch (error) {
        console.error('Error:', error);
    }
}

// scrapeData();

const mailsender = () => {
    const nodemailer = require("nodemailer");

    let sender = nodemailer.createTransport({
        secure: true,
        port: 465,
        service: 'gmail',
        auth: {
            user: process.env.USER_Email,
            pass: process.env.pass
        }
    });

    let mail = {
        from: process.env.From_Email,
        to: fs.readFileSync('data.txt', 'utf8'),
        subject: "",
        text: "That was easy!",
        attachments: [{
            filename: 'Kaustubh_Resume.pdf',
            content: fs.createReadStream(`./Kaustubh_Resume.pdf`)
        }]
    };


    sender.sendMail(mail, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent successfully: " +
                mail.to + info.response);
        }
    });
}

mailsender();