let express = require('express');
let app = express();

app.use(express.static('www'));

let listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
