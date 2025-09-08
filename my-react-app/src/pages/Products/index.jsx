import React from "react";
function Products() {
    const [loading, setLoading] = React.useState(true);
    const [posts, setPosts] = React.useState([]);
    const [selectedPost, setSelectedPost] = React.useState(null);

    React.useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts?_limit=12')
            .then(res => res.json())
            .then(data => setPosts(data))
            .finally(() => setLoading(false));
    }, []);

    const truncate = (text, length = 100) =>
        text.length > length ? text.substring(0, length) + "…" : text;

    if (loading) {
        return <p>Loading...</p>
    }

    return (
        <div>
            <h2>Danh sách bài viết</h2>
            <div className="grid">
                {posts.map(post => (
                    <div className="card" key={post.id}>
                        <p><b>ID: {post.id}</b></p>
                        <h3>{post.title}</h3>
                        <p>{truncate(post.body, 100)}</p>
                        <button className="btn" onClick={() => setSelectedPost(post)}>
                            Xem chi tiết
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal hiển thị chi tiết */}
            {selectedPost && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close-btn" onClick={() => setSelectedPost(null)}>×</button>
                        <h2>{selectedPost.title}</h2>
                        <p>{selectedPost.body}</p>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Products;