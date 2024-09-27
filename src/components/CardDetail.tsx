/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronLeft, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { ApiKey } from '../utils/Key';

// Define an interface for the blog post
interface BlogPost {
  id: string;
  title: string;
  body: string;
}

const GitHubBlogPost = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const blogId = searchParams.get('id');

  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    // Check if blogId exists
    if (!blogId) {
      setLoading(false); // Stop loading if no blogId
      return;
    }

    // Fetching data from API
    const myHeaders = new Headers();
    myHeaders.append('apiKey', ApiKey);
    myHeaders.append('Content-Type', 'application/json');

    const graphql = JSON.stringify({
      query: `
        query getBlogs {
          blogCollection(filter: {id: {eq: "${blogId}"}}) {
            edges {
              node {
                id
                title
                body
              }
            }
          }
        }
      `,
      variables: {},
    });

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: graphql,
      redirect: 'follow',
    };

    fetch('https://vorwurfphwkozuowdpgy.supabase.co/graphql/v1', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const blogs = result.data?.blogCollection?.edges?.map((edge: any) => edge.node);
        if (blogs && blogs.length > 0) {
          setBlogPost(blogs[0]); // Set the first blog post data
        } else {
          console.warn('No blogs found for the given ID');
        }
        setLoading(false); // Stop loading once data is fetched
      })
      .catch((error) => {
        console.error('Error fetching blog data:', error);
        setLoading(false); // Stop loading even if there's an error
      });
  }, [blogId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-300 p-4 md:p-8">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-300 p-4 md:p-8">
        <h2>No blog post found.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-blue-400">GITHUB BLOG</h1>
      </header>

      <main className="max-w-3xl mx-auto">
        <nav className="mb-4">
          <button onClick={goBack} className="text-blue-400 hover:underline flex items-center">
            <ChevronLeft size={20} className="mr-1" />
            Back
          </button>
        </nav>

        <article className="bg-gray-800 rounded-lg p-8">
          <header className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">{blogPost.title}</h2>
            <div className="flex items-center text-gray-400">
              <Clock size={20} className="mr-2" />
              <span>1 hour ago</span>
            </div>
          </header>

          <div className="prose prose-invert max-w-none">
            <p className="mb-4 text-xl">
              Programming languages all have built-in data structures, but these often differ from one language to
              another. This article attempts to list the built-in data structures available in JavaScript and what
              properties they have. These can be used to build other data structures. Wherever possible, comparisons with other
              languages are drawn.
            </p>

            <h3 className="text-2xl font-semibold text-blue-400 mb-2">{blogPost.body}</h3>
            <p className="mb-4 text-xl">
              JavaScript is a loosely typed and dynamic language. Variables in JavaScript are not directly associated with any
              particular value type, and any variable can be assigned (and re-assigned) values of all types:
            </p>

            <pre className="bg-gray-700 p-4 rounded-md overflow-x-auto">
              <code className="text-sm">
                {`let foo = 42;    // foo is now a number
                    foo = 'bar';  // foo is now a string
                        foo = true;   // foo is now a boolean`}
              </code>
            </pre>
          </div>
        </article>
      </main>
    </div>
  );
};

export default GitHubBlogPost;
