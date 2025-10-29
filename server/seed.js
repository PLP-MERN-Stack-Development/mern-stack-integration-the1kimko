const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Post = require('./models/Post');
const Category = require('./models/Category');
const User = require('./models/User');
require('dotenv').config();

const connectDB = require('./config/db');
connectDB();

const categories = [
  { name: 'Technology', slug: 'technology', color: '#3b82f6' },
  { name: 'Design', slug: 'design', color: '#8b5cf6' },
  { name: 'Lifestyle', slug: 'lifestyle', color: '#10b981' },
  { name: 'Business', slug: 'business', color: '#f59e0b' },
  { name: 'Travel', slug: 'travel', color: '#ef4444' },
];

const seed = async () => {
  try {
    // Clear old data
    await Post.deleteMany({});
    await Category.deleteMany({});

    // Create categories
    const createdCategories = await Category.insertMany(categories);

    // Get first user (Kim2)
    const user = await User.findOne({ email: 'kim2@test.com' });
    if (!user) throw new Error('User not found');

    // Create 10 posts
    const posts = [];
    for (let i = 0; i < 10; i++) {
      const category = faker.helpers.arrayElement(createdCategories);
      posts.push({
        title: faker.lorem.sentence(),
        slug: faker.lorem.slug(),
        content: `<p>${faker.lorem.paragraphs(3)}</p>`,
        excerpt: faker.lorem.sentence(),
        featuredImage: `https://picsum.photos/800/400?random=${i}`,
        author: user._id,
        category: category._id,
        tags: faker.lorem.words(3).split(' '),
        published: true,
        viewCount: faker.number.int({ min: 0, max: 500 }),
        createdAt: faker.date.recent({ days: 30 }),
      });
    }

    await Post.insertMany(posts);
    console.log('10 posts seeded!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();