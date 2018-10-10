let express = require('express');
let app = express();

app.use(express.static('views'));
app.use(express.static('node_modules/p5/lib'));
app.use(express.static('node_modules/p5/lib/addons'));

let listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
