
import { Link, useNavigate } from "react-router-dom";

interface Postprop {
  id: number | string;
  title: string;
  content: string;
}
const BlogPostCard = ({id, title, content} : Postprop) => {
  const navigate = useNavigate();
  const goto = ()=>{
    navigate(`/card?id=${id}`); // replace with your actual path
  }
  return (
    <div  className="bg-gray-800 rounded-lg p-6 h-[15rem] flex flex-col justify-evenly ">
      <div className="flex justify-between items-start mb-4">
        <h2 onClick={goto} className="text-xl font-bold text-gray-100 leading-tight cursor-pointer">
          {title}
        </h2>
        <Link to={`/edit?id=${id}`} className="text-gray-400 hover:text-gray-300 transition-colors">
          Edit
        </Link>
      </div>
      <p className="text-gray-400 text-sm">
       {content}
      </p>
    </div>
  );
};

export default BlogPostCard;