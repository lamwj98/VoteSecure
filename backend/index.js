const express = require("express")
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
  });

const port = 5000; // or any other port you prefer
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});