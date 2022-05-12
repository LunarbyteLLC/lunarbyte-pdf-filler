import express from "express"
//@ts-ignore
import pdfFillForm from "pdf-fill-form";

const port = process.env.PORT;
const app = express();
const multer = require('multer');
const upload = multer();

app.post('/render', upload.single('pdf'), async function(req, res, next) {
    try {
        const pdf = req.file as Express.Multer.File;
        if (!pdf) {
            return res.status(400).send('Missing PDF file');
        }
        const data = JSON.parse(JSON.stringify(req.body));
        const options = data['options'];
        const fileName = data['fileName'] || 'pdf';
        delete data['options'];
        delete data['filename'];
        if (Object.keys(data).length === 0 || !options) {
            return res.status(400).send('Missing data or options');
        }
        const filledPDF = await pdfFillForm.writeBuffer(pdf.buffer, data, options);
        res.set('Content-Type', 'application/pdf');
        res.set('Content-Disposition', `attachment;filename=${fileName}`);
        return res.send(Buffer.from(filledPDF));
    } catch (error) {
        console.error('Error filling pdf', error);
        next(error);
    }
});

app.listen(port, () => console.log(`App listening on ${port}`));
