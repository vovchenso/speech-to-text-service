import express from 'express';

const app = express();

app.use(express.static('example'));

const PORT = 8888;
app.listen(PORT, () => console.log(`Example available on localhost:${PORT}`));
