import express from "express"

const port = process.env.PORT;
const app = express();
const multer = require('multer');
const upload = multer();
const Forms = require('pdf-forms')


app.post('/render', upload.single('pdf'), async function(req, res, next) {
    try {
        const pdf = req.file as Express.Multer.File;
        if (!pdf) {
            return res.status(400).send('Missing PDF file');
        }
        const data = JSON.parse(JSON.stringify(req.body));
        const yourTaxes = Forms.load(pdf.buffer);
        console.log(yourTaxes);
        const fields = await yourTaxes.getFields();
        console.log(fields);

        const fillIn = {}
        for (const key in fields) { // fill everything with a 0
            // @ts-ignore
            fillIn[key] = '0';
        }

        const filledOut = await yourTaxes.fillOut(fillIn);

        res.set('Content-Type', 'application/pdf');
        return res.send('temp');
    } catch (error) {
        console.error('Error filling pdf', error);
        next(error);
    }
});

app.listen(port, () => console.log(`App listening on ${port}`));
