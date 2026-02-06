import express from 'express'
const app = express();

app.get('/', (req, res) => {
    res.send("Hello World")
})

const PORT = 5000
app.listen(PORT, () => {
    console.log(`Server listning on http://localhost:${PORT}`);
})