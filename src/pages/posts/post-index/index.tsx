import useSWR from 'swr';
import { Link } from 'react-router-dom';

interface Post {
  id: number;
  title: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

function PostIndex() {
  const { data: posts, error } = useSWR<Post[]>('https://jsonplaceholder.typicode.com/posts', fetcher, { suspense: true });

  if (error) return <div>エラーが発生しました</div>;
  if (!posts) return <div>読み込み中...</div>;

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link to={`/posts/${post.id}`}>
            {post.id}:{post.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default PostIndex;