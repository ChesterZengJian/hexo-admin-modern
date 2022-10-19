import { HashRouter, Routes, Route } from 'react-router-dom';
import DefaultLayout from '@/pages/Layout';
import './App.scss';
import { PostList, PostEdit } from './pages/Post';
import Login from './pages/Login';

function App() {
    return (
        <HashRouter>
            <div className="app">
                <Routes>
                    <Route path="/" element={<DefaultLayout />}>
                        <Route index path="/" element={<PostList />}></Route>
                        <Route path="/posts/new" element={<PostEdit />}></Route>
                        <Route path="/posts/:id" element={<PostEdit />}></Route>
                    </Route>
                    <Route path="/login" element={<Login />}></Route>
                </Routes>
            </div>
        </HashRouter>
    );
}

export default App;
