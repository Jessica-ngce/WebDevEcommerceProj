const bcrypt = require("bcryptjs");
const mongodb = require("mongodb");
const db = require("../data/database");

class User {
  constructor(email, password, fullname, street, postal, city) {
    this.email = email;
    this.password = password;
    this.name = fullname;
    this.address = {
      street: street,
      postalCode: postal,
      city: city,
    };
  }

  // get user document
  static findById(userId) {
    const uid = new mongodb.ObjectId(userId);

    // set password to -1 => excluded when data being fetch
    return db
      .getDb()
      .collection("users")
      .findOne({ _id: uid }, { projection: { password: 0 } });
  }

  getUserWithSameEmail() {
    // findOne is a promise
    return db.getDb().collection("users").findOne({ email: this.email });
  }

  async existsAlready() {
    const existuser = await this.getUserWithSameEmail();
    if (existuser) {
      return true;
    }
    return false;
  }

  async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);

    // collections are table with no datatypes (mongodb)
    await db.getDb().collection("users").insertOne({
      email: this.email,
      // dont store password in plain text
      password: hashedPassword,
      name: this.name,
      // address will be nested object/ document
      // it's okay to store in noSQL database
      // if SQL, need another table to store it
      address: this.address,
    });
  }

  hasMatchedPassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }
}

module.exports = User;
