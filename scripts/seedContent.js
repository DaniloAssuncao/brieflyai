const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

const Content = require('../src/models/Content').default;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-db-name';

const contentData = [
  {
    title: "The Rise of Generative AI in 2024",
    summary: "A deep dive into how generative AI is transforming industries, with real-world examples and future predictions.",
    tags: ["AI", "Generative", "Trends"],
    source: {
      name: "AI Explained",
      avatarUrl: "https://yt3.ggpht.com/ytc/AMLnZu9vQw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Q=s88-c-k-c0x00ffffff-no-rj",
      type: "youtube",
      url: "https://www.youtube.com/channel/UCai123456789"
    },
    date: new Date("2024-05-01"),
    readTime: "8 min watch",
    favorite: false,
    originalUrl: "https://www.youtube.com/watch?v=xyz123abc"
  },
  {
    title: "AI Weekly: The Best AI Tools for Productivity",
    summary: "A curated list of the top AI tools to boost your productivity, with hands-on reviews and tips.",
    tags: ["AI", "Productivity", "Tools"],
    source: {
      name: "AI Weekly Newsletter",
      avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg",
      type: "newsletter",
      url: "https://aiweekly.co"
    },
    date: new Date("2024-04-28"),
    readTime: "5 min read",
    favorite: false,
    originalUrl: "https://aiweekly.co/issues/123"
  },
  {
    title: "How LLMs Work: A Visual Guide",
    summary: "This article explains the inner workings of large language models with easy-to-understand visuals.",
    tags: ["LLM", "NLP", "Education"],
    source: {
      name: "Towards Data Science",
      avatarUrl: "https://randomuser.me/api/portraits/women/32.jpg",
      type: "article",
      url: "https://towardsdatascience.com"
    },
    date: new Date("2024-04-20"),
    readTime: "7 min read",
    favorite: false,
    originalUrl: "https://towardsdatascience.com/how-llms-work-visual-guide"
  },
  {
    title: "Prompt Engineering for Beginners",
    summary: "A newsletter issue dedicated to the basics of prompt engineering, with practical examples.",
    tags: ["Prompt Engineering", "Newsletter", "AI"],
    source: {
      name: "Prompt Mastery",
      avatarUrl: "https://randomuser.me/api/portraits/men/55.jpg",
      type: "newsletter",
      url: "https://promptmastery.com"
    },
    date: new Date("2024-04-15"),
    readTime: "4 min read",
    favorite: false,
    originalUrl: "https://promptmastery.com/issues/42"
  },
  {
    title: "YouTube's New AI Features Explained",
    summary: "A video breakdown of the latest AI-powered features on YouTube and how creators can use them.",
    tags: ["YouTube", "AI", "Features"],
    source: {
      name: "Creator Tech",
      avatarUrl: "https://yt3.ggpht.com/ytc/AMLnZu9vQw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Qw7Q=s88-c-k-c0x00ffffff-no-rj",
      type: "youtube",
      url: "https://www.youtube.com/channel/UCcreator123"
    },
    date: new Date("2024-04-10"),
    readTime: "6 min watch",
    favorite: false,
    originalUrl: "https://www.youtube.com/watch?v=ai-features"
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    await Content.deleteMany({});
    await Content.insertMany(contentData);
    console.log('Seeded content!');
  } catch (err) {
    console.error('Error seeding content:', err);
  } finally {
    mongoose.disconnect();
  }
}

seed(); 