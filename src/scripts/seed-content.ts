import connectToDatabase from '@/lib/db';
import Content from '@/models/Content';
import { IContentCreateData } from '@/types';

const sampleContent: IContentCreateData[] = [
  {
    title: "The Future of AI in Web Development",
    summary: "Exploring how artificial intelligence is revolutionizing the way we build and maintain web applications. From automated code generation to intelligent debugging, AI tools are becoming essential for modern developers.",
    tags: ["AI", "Web Development", "Technology", "Future"],
    source: {
      name: "TechCrunch",
      avatarUrl: "https://techcrunch.com/wp-content/uploads/2015/02/cropped-cropped-favicon-gradient.png",
      type: "article",
      url: "https://techcrunch.com"
    },
    date: new Date('2024-01-15'),
    readTime: "5 min read",
    favorite: true,
    originalUrl: "https://techcrunch.com/ai-web-development"
  },
  {
    title: "Next.js 14: What's New and Exciting",
    summary: "A comprehensive overview of the latest features in Next.js 14, including improved performance, new routing capabilities, and enhanced developer experience. Learn how these updates can boost your React applications.",
    tags: ["Next.js", "React", "JavaScript", "Framework"],
    source: {
      name: "Vercel",
      avatarUrl: "https://vercel.com/favicon.ico",
      type: "article",
      url: "https://vercel.com"
    },
    date: new Date('2024-01-10'),
    readTime: "8 min read",
    originalUrl: "https://vercel.com/blog/nextjs-14"
  },
  {
    title: "Building Scalable TypeScript Applications",
    summary: "Best practices for structuring large TypeScript projects, implementing proper type safety, and maintaining code quality as your application grows. Includes real-world examples and common pitfalls to avoid.",
    tags: ["TypeScript", "Architecture", "Best Practices", "Scalability"],
    source: {
      name: "Dev.to",
      avatarUrl: "https://dev.to/favicon.ico",
      type: "article",
      url: "https://dev.to"
    },
    date: new Date('2024-01-08'),
    readTime: "12 min read",
    originalUrl: "https://dev.to/typescript-scalable-apps"
  },
  {
    title: "React Hooks Deep Dive",
    summary: "An in-depth exploration of React Hooks, from the basics of useState and useEffect to advanced patterns with custom hooks. Perfect for developers looking to master modern React development.",
    tags: ["React", "Hooks", "JavaScript", "Frontend"],
    source: {
      name: "React Newsletter",
      avatarUrl: "https://react.dev/favicon.ico",
      type: "newsletter",
      url: "https://react.dev"
    },
    date: new Date('2024-01-05'),
    readTime: "15 min read",
    favorite: true,
    originalUrl: "https://react.dev/hooks-deep-dive"
  },
  {
    title: "Modern CSS Techniques for 2024",
    summary: "Discover the latest CSS features and techniques that are changing how we style web applications. From container queries to CSS Grid subgrid, learn what's possible with modern CSS.",
    tags: ["CSS", "Frontend", "Design", "Web Development"],
    source: {
      name: "CSS-Tricks",
      avatarUrl: "https://css-tricks.com/favicon.ico",
      type: "youtube",
      url: "https://youtube.com/@css-tricks"
    },
    date: new Date('2024-01-03'),
    readTime: "20 min watch",
    originalUrl: "https://youtube.com/watch?v=modern-css-2024"
  }
];

async function seedContent() {
  try {
    console.log('🌱 Starting content seeding...');
    
    // Connect to database
    await connectToDatabase();
    console.log('✅ Connected to database');
    
    // Clear existing content
    await Content.deleteMany({});
    console.log('🗑️  Cleared existing content');
    
    // Insert sample content
    const insertedContent = await Content.insertMany(sampleContent);
    console.log(`✅ Inserted ${insertedContent.length} content items`);
    
    // Display inserted content
    insertedContent.forEach((item, index) => {
      console.log(`${index + 1}. ${item.title} (${item.source.type})`);
    });
    
    console.log('🎉 Content seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding content:', error);
  } finally {
    process.exit();
  }
}

// Run the seeding function
seedContent(); 