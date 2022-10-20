const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const newProduct = { productId: product._id, quantity: 1 };
  const indexProduct = this.cart.items.findIndex(
    (cp) => cp.productId.toString() === product._id.toString()
  );
  const updatedCartItems = [...this.cart.items];
  if (indexProduct >= 0) {
    updatedCartItems[indexProduct].quantity += 1;
  } else {
    updatedCartItems.push(newProduct);
  }
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  this.cart.items = this.cart.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart.items = [];
  return this.save();
};

module.exports = mongoose.model('User', userSchema);

// class User {
//   constructor(name, email, cart, id) {
//     this.name = name;
//     this.email = email;
//     this.cart = cart;
//     this._id = !!id ? new ObjectId(id) : null;
//   }

//   save() {
//     const db = getDB();
//     let dbOp;
//     if (this._id) {
//       dbOp = db
//         .collection('users')
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       dbOp = db.collection('users').insertOne(this);
//     }
//     return dbOp;
//     // .then((result) => {
//     //   console.log(result);
//     // })
//     // .catch((err) => console.log(err));
//   }

//   addToCart(product) {
//     const db = getDB();
//     console.log(product);
//     let updatedCart;
//     const newProduct = { productId: new ObjectId(product._id), quantity: 1 };
//     if (this.cart) {
//       const indexProduct = this.cart.items.findIndex(
//         (cp) => cp.productId.toString() === product._id.toString()
//       );
//       const updatedCartItems = [...this.cart.items];
//       if (indexProduct >= 0) {
//         updatedCartItems[indexProduct].quantity += 1;
//       } else {
//         updatedCartItems.push(newProduct);
//       }
//       updatedCart = {
//         items: updatedCartItems,
//       };
//     } else {
//       updatedCart = {
//         items: [newProduct],
//       };
//     }
//     return db
//       .collection('users')
//       .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
//   }

//   getCart() {
//     const db = getDB();
//     const productsIds = this.cart.items.map((item) => item.productId);
//     return db
//       .collection('products')
//       .find({
//         _id: {
//           $in: productsIds,
//         },
//       })
//       .toArray()
//       .then((products) =>
//         products.map((product) => ({
//           ...product,
//           quantity: this.cart.items.find(
//             (i) => i.productId.toString() === product._id.toString()
//           ).quantity,
//         }))
//       );
//   }

//   deleteItemFromCart(productId) {
//     const db = getDB();
//     const updatedCartItems = this.cart.items.filter(
//       (item) => item.productId.toString() !== productId.toString()
//     );
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: this._id },
//         { $set: { cart: { ...this.cart, items: updatedCartItems } } }
//       );
//   }

//   addOrder() {
//     const db = getDB();
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             name: this.name,
//           },
//         };
//         return db.collection('orders').insertOne(order);
//       })
//       .then((result) => {
//         this.cart = { items: [] };
//         return db
//           .collection('users')
//           .updateOne(
//             { _id: this._id },
//             { $set: { cart: { ...this.cart, items: [] } } }
//           );
//       });
//   }

//   getOrders() {
//     const db = getDB();
//     return db
//       .collection('orders')
//       .find({ 'user._id': new ObjectId(this._id) })
//       .toArray();
//   }

//   static findById(userId) {
//     const db = getDB();
//     return db.collection('users').findOne({ _id: new ObjectId(userId) });
//   }
// }
