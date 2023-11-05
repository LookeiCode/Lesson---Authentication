express = require('express');
app = express();
PORT = 8080;

// Placeholder
app.get('/', (req, res) => {
    res.send('hello world');
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
});