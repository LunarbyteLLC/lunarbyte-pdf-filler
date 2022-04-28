import express from "express"
//@ts-ignore
import pdfFillForm from "pdf-fill-form";

const port = process.env.PORT;
const app = express();
const multer = require('multer');
const upload = multer();

app.post('/render', upload.single('pdf'), async function(req, res, next) {
    const pdf = req.file as Express.Multer.File;
    const data = JSON.parse(JSON.stringify(req.body));
    const options = data['options'];
    delete data['options'];

    const filledPDF = await pdfFillForm.writeBuffer(pdf.buffer, flagMissingFields(data), options);
    res.set('Content-Type', 'application/pdf');
    return res.send(Buffer.from(filledPDF));
});

app.listen(port, () => console.log(`App listening on ${port}`));

function flagMissingFields(data: any) {
    for (let field in data) {
        if (!data[field]) {
            data[field] = 'MISSING';
        }
    }
    return data;
}
