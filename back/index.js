const express = require('express');
const cors = require('cors');
const sharp = require('sharp');
const compression = require('compression')

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware برای پردازش فایل‌های multipart/form-data
const multer = require('multer');
const upload = multer();

// استفاده از CORS
app.use(cors());
app.use(compression()); 


app.post('/convert', upload.single('image'), async (req, res) => {
    try {
        if (!req.file ||!req.file.mimetype.startsWith('image/')) {
            return res.status(400).send('Invalid file type. Please upload an image.');
        }

        // دسترسی به فایل ارسال شده
        console.log(req.file); // اینجا console.log() اضافه شده است

        const imageBuffer = req.file.buffer;
        // تبدیل عکس به فرمت WebP
        const outputBuffer = await sharp(imageBuffer).toFormat('webp').toBuffer();

        // ارسال عکس تبدیل شده به عنوان پاسخ
        res.type('webp').send(outputBuffer);
    } catch (error) {
        console.error('خطا در تبدیل عکس:', error);
        res.status(500).send('خطا در تبدیل عکس.');
    }
});



// تابع برای دریافت عکس تبدیل شده
app.get('/converted-image', (req, res) => {
    try {
        // ارسال فایل تبدیل شده به عنوان پاسخ
        res.sendFile('/path/to/converted/image.webp');
    } catch (error) {
        console.error('خطا در ارسال عکس:', error);
        res.status(500).send('خطا در ارسال عکس.');
    }
});


// شروع سرور
app.listen(PORT, () => {
    console.log(`start server on ${PORT}`);
});
