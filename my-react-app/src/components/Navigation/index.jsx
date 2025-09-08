
import { BrowserRouter, Routes, Route } from 'react-router';
import Home from "../../pages/Home";
import Counter from "../../pages/Counter";
import Todos from "../../pages/Todos";
import Profile from "../../pages/Profile";
import Products from "../../pages/Products";
import Comments from "../../pages/Comments";
import Weather from "../../pages/Weather";
import Buttons from "../../pages/Buttons";
function Navigation() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/counter" element={<Counter />}></Route>
                <Route path="/todo" element={<Todos />}></Route>
                <Route path="/profile" element={<Profile />}></Route>
                <Route path="/products" element={<Products />}></Route>
                <Route path="/comments" element={<Comments />}></Route>
                <Route path="/weather" element={<Weather />}></Route>
                <Route path="/buttons" element={<Buttons />}></Route>
            </Routes>
        </BrowserRouter >
    )
        ;
}
export default Navigation;