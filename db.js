import Sequelize from 'sequelize';
import Faker from 'faker';
import _ from 'lodash';

const connection = new Sequelize('naganoblog', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  port: 9898,

  pool: {
    max: 10,
    min: 0,
    idle: 10000,
  },

});

const User = connection.define('user', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true,
    },
  },
});

const Post = connection.define('post', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  content: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// Relations
User.hasMany(Post);
Post.belongsTo(User);

connection.sync({ force: true }).then(() => {
  _.times(10, () => {
    return User.create({
      firstName: Faker.name.firstName(),
      lastName: Faker.name.lastName(),
      email: Faker.internet.email(),
    }).then(user => {
      return user.createPost({
        title: `Sample post by ${user.firstName}`,
        content: 'here is some content',
      });
    });
  });
});

export default connection;
