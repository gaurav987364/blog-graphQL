import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { ApiKey } from '../utils/Key';

interface BlogFormData {
  blogTitle: string;
  blogContent: string;
  id?: string; // id is optional since it may not be available during creation
}

const GitHubBlogEditor = () => {
  const { register, handleSubmit, reset } = useForm<BlogFormData>();
  const [blogData, setBlogData] = useState<BlogFormData | null>(null);
  console.log(blogData);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const blogId = searchParams.get('id');

  const onSubmit: SubmitHandler<BlogFormData> = async (data) => {
    setBlogData(data);

    try {
      if (blogId) {
        // Update blog if blogId exists
        await updateBlog(data);
      } else {
        // Create a new blog
        await createBlog(data);
      }

      // Clear the form and navigate back to the home page
      reset();
      navigate('/');
    } catch (error) {
      console.error('Error submitting blog:', error);
    }
  };

  const createBlog = async (data: BlogFormData): Promise<void> => {
    const myHeaders = new Headers();
    myHeaders.append("apiKey", `${ApiKey}`);
    myHeaders.append("Content-Type", "application/json");

    const graphql = JSON.stringify({
      query: `mutation createBlog($title: String!, $body: String!) {
        insertIntoblogCollection(objects: {title: $title, body: $body}) {
          records {
            id
            title
            body
          }
        }
      }`,
      variables: { title: data.blogTitle, body: data.blogContent },
    });

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: graphql,
      redirect: 'follow',
    };

    try {
      const response = await fetch("https://vorwurfphwkozuowdpgy.supabase.co/graphql/v1", requestOptions);
      const result = await response.json();
      console.log('Create result:', result);
      alert('Blog created successfully! Please refresh to see new content.');
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Error creating blog, please try again.');
    }
  };

  const updateBlog = async (data: BlogFormData): Promise<void> => {
    const myHeaders = new Headers();
    myHeaders.append("apiKey", `${ApiKey}`);
    myHeaders.append("Content-Type", "application/json");

    const graphql = JSON.stringify({
      query: `mutation updateBlog {
        updateblogCollection(set: {title: "${data.blogTitle}", body: "${data.blogContent}"}, filter: {id: {eq: "${blogId}"}}) {
          affectedCount
          records {
            id
            title
            body
          }
        }
      }`,
      variables: {},
    });

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: graphql,
      redirect: 'follow',
    };

    try {
      const response = await fetch("https://vorwurfphwkozuowdpgy.supabase.co/graphql/v1", requestOptions);
      const result = await response.json();
      console.log('Update result:', result);
      alert('Blog updated successfully! Please refresh to see new content.');
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Error updating blog, please try again.');
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!blogId) {
      console.error('Blog ID is required for deletion');
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("apiKey", `${ApiKey}`);
    myHeaders.append("Content-Type", "application/json");

    const graphql = JSON.stringify({
      query: `mutation deleteBlog {
        deleteFromblogCollection(filter: {id: {eq: "${blogId}"}}) {
          affectedCount
          records {
            id
            title
            body
          }
        }
      }`,
      variables: {},
    });

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: graphql,
      redirect: 'follow',
    };

    try {
      const response = await fetch("https://vorwurfphwkozuowdpgy.supabase.co/graphql/v1", requestOptions);
      const result = await response.json();
      console.log('Delete result:', result);
      alert('Blog deleted successfully! Please refresh to see new content.');
      navigate('/');
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Error deleting blog, please try again.');
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-blue-300 text-2xl font-bold mb-8 text-center">GITHUB BLOG</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">{blogId ? 'Edit Blog' : 'Create Blog'}</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label htmlFor="blogTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Blog Title
              </label>
              <input
                {...register('blogTitle', { required: true })}
                id="blogTitle"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="blogContent" className="block text-sm font-medium text-gray-700 mb-1">
                Blog Content
              </label>
              <textarea
                {...register('blogContent', { required: true })}
                id="blogContent"
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input type="hidden" {...register('id')} value={blogId || ""} />
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {blogId ? 'Update' : 'Create'}
              </button>
              {blogId && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Delete
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GitHubBlogEditor;
