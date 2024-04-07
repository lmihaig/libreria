import express, { Request, Response } from 'express';
import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('test');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

