import { Search } from 'lucide-react';
import Card from './Card';
import { FaBuilding, FaGithub } from "react-icons/fa";
import { MdPeopleAlt } from "react-icons/md";
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const GitHubBlog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  useEffect(() => {
    const fetchBlogData = async () => {
      const myHeaders = new Headers();
      myHeaders.append(
        'apiKey',
        `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvcnd1cmZwaHdrb3p1b3dkcGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY3Mzc4ODMsImV4cCI6MjA0MjMxMzg4M30.RecumY6-7pD0Gh1_EXRibOfTuuDrBWAP7AtwfCiReFo` // Use your actual API key
      );
      myHeaders.append('Content-Type', 'application/json');

      const graphql = JSON.stringify({
        query: `
          query getBlogs {
            blogCollection {
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

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: graphql,
        redirect: 'follow',
      };

      try {
        const response = await fetch(
          'https://vorwurfphwkozuowdpgy.supabase.co/graphql/v1',
          requestOptions
        );
        const result = await response.json();
        const blogs = result.data?.blogCollection?.edges?.map((edge: any) => ({
          id: edge.node.id,
          title: edge.node.title,
          content: edge.node.body,
        }));
        setBlogPosts(blogs);
      } catch (error) {
        console.error('Error fetching blog data:', error);
      }
    };

    fetchBlogData();
  }, []);

  // Function to handle the search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Filter blog posts based on the search term
  const filteredBlogPosts = blogPosts.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 p-4 lg:p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-blue-400 mb-4 text-center">GITHUB BLOG</h1>
        <div className="w-full lg:w-[80%] xl:w-[70%] mx-auto bg-gray-800 rounded-lg p-4 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
          <img src="https://images.pexels.com/photos/28003084/pexels-photo-28003084/free-photo-of-portrait-of-a-young-woman-in-a-crop-top-and-suit.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" alt="Profile" className="w-32 h-32 rounded-xl" />
          <div className="text-center md:text-left flex-1">
            <h2 className="text-xl md:text-2xl font-semibold mb-2 text-white">Cameron Williamson</h2>
            <p className="text-sm text-gray-400 mb-2">Integer tincidunt ante vel ipsum praesent blandit lacinia erat vestibulum sed magna at nunc commodo placerat.</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500">
              <span className='flex items-center gap-1 cursor-pointer hover:text-white transition-all'><FaGithub size={19}/>cameronwill</span>
              <span className='flex items-center gap-1 cursor-pointer hover:text-white transition-all'><FaBuilding size={19}/>Rocketseat</span>
              <span className='flex items-center gap-1 cursor-pointer hover:text-white transition-all'><MdPeopleAlt size={19} />32 seguidores</span>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full lg:w-[80%] xl:w-[70%] mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Publicações</h3>
          <span className="text-sm text-gray-500">{filteredBlogPosts.length} publicações</span>
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Buscar conteúdo"
            value={searchTerm}
            onChange={handleSearchChange} // Update search term on change
            className="w-full bg-gray-800 rounded-lg p-3 pl-10 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBlogPosts.map(({ id, title, content }) => (
            <Card 
              key={id} 
              id={id}
              title={title}
              content={content} 
            />
          ))}
        </div>
    
        <div className='mt-6'>
          <Link to={`/edit`} className='bg-gray-800 px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors'>Add Blog</Link>
        </div>
      </main>
    </div>
  );
};

export default GitHubBlog;
