import express, { Request, Response } from 'express';
import multer from 'multer';
import * as Minio from 'minio'
import dotenv from 'dotenv';

dotenv.config();


const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || '',
  port: 9000,
  useSSL: true,
  accessKey: process.env.MINIO_ACCESS_KEY || '',
  secretKey: process.env.MINIO_SECRET_KEY || '',
})

const app = express();
const port = 310;

const upload = multer({ dest: 'uploads/' }); // Configure destination for uploaded files (optional)

async function uploadImage(req: Request, res: Response): Promise<void> {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error uploading image.');
      return;
    }

    const imageFile = req.file;
    const route = req.body.bucket;

    if (!imageFile) {
      res.status(400).send('No image uploaded.');
      return;
    }

    const fileName = imageFile.originalname;
    const filePath: string = './uploads/' + imageFile.filename

    try {

        const result = await minioClient.fPutObject('poscloud', fileName, filePath);

        res.status(200).send(result);
      
    } catch (error) {
      console.error(error);
      res.status(500).send('Error uploading image.');
    }
  });
}

async function deleteImage(req: Request, res: Response): Promise<void> {
  const imageName = req.params.imageName;

  if (!imageName) {
    res.status(400).send('Missing image name.');
    return;
  }

  try {
    await minioClient.removeObject('your-bucket-name', imageName);
    res.status(200).send('Image deleted successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting image.');
  }
}

app.post('/upload-image', uploadImage);
app.delete('/delete-image/:imageName', deleteImage);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
