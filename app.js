const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

require('./util/env');
const errorController = require('./controllers/error');
// const User = require('./models/user');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const mongoConnect = require('./util/database').mongoConnect;

const PORT = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const USER_ID = 1;

// app.use((req, res, next) => {
//   // User.findByPk(USER_ID)
//   //   .then((user) => {
//   //     req.user = user;
//   //     next();
//   //   })
//   //   .catch((err) => console.log(err));
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(PORT);
  console.log(`Server listening at port ${PORT}`);
});
