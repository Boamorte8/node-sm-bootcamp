const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

require('./util/env');
const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const User = require('./models/user');
const Product = require('./models/product');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const PORT = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk('0891831d-8f17-4176-9cc0-58a14c25b0c1')
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, {
  constraints: true,
  onDelete: 'CASCADE',
});
User.hasMany(Product, {});
User.hasOne(Cart, {});
Cart.belongsTo(User, {});
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    return User.findByPk('0891831d-8f17-4176-9cc0-58a14c25b0c1');
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: 'Teban', email: 'test@test.com' });
    }
    return Promise.resolve(user);
  })
  .then((user) => {
    return user.createCart();
    // console.log(user);
  })
  .then((cart) => {
    app.listen(PORT);
    console.log(`Server listening at port ${PORT}`);
    // console.log(cart);
  })
  .catch((err) => {
    console.log(err);
  });
