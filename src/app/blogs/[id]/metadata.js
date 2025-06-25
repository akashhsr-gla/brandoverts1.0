import connectToDatabase from '@/lib/mongodb';
import Blog from '@/models/Blog';

export async function generateMetadata({ params }) {
  const { id } = params;
  
  try {
    await connectToDatabase();
    const blog = await Blog.findById(id).populate('author', 'username displayName');
    
    if (!blog) {
      return {
        title: 'Blog Not Found | Brandoverts',
        description: 'The requested blog post could not be found.'
      };
    }
    
    // Strip HTML tags for description
    const plainTextContent = blog.content.replace(/<[^>]*>/g, '');
    const description = plainTextContent.substring(0, 160) + '...';
    
    return {
      title: `${blog.title} | Brandoverts Blog`,
      description: description,
      openGraph: {
        title: `${blog.title} | Brandoverts Blog`,
        description: description,
        url: `https://brandoverts.com/blogs/${id}`,
        siteName: 'Brandoverts Blog',
        images: [
          {
            url: blog.coverImage || 'https://brandoverts.com/logo.png',
            width: 1200,
            height: 630,
            alt: blog.title,
          },
        ],
        locale: 'en_US',
        type: 'article',
        publishedTime: blog.createdAt,
        authors: blog.author?.displayName || blog.author?.username || 'Brandoverts',
        tags: blog.tags || [],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${blog.title} | Brandoverts Blog`,
        description: description,
        images: [blog.coverImage || 'https://brandoverts.com/logo.png'],
      },
      alternates: {
        canonical: `https://brandoverts.com/blogs/${id}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Brandoverts Blog',
      description: 'Insights, tips, and trends in marketing, branding, and digital strategy.',
    };
  }
} 