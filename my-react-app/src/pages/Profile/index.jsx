import React from "react";
function UserData() {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/users/1")
            .then(res => res.json())
            .then(data => setUser(data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
        </div>
    );
}
export default UserData;