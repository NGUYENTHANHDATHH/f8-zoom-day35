import { NavLink } from "react-router";
import navigation from "../../navigation.json";
function Home() {
    return (
        <>
            <h1>Chào mừng đến với F8 React Day 35</h1>

            {
                navigation.map((nav) => (
                    <div key={nav.to}>
                        <NavLink to={nav.to}>{nav.title}</NavLink>
                    </div>
                ))
            }
        </>
    );
}

export default Home;