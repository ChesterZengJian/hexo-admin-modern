import { HashRouter, Routes, Route } from 'react-router-dom';
import DefaultLayout from '@/pages/Layout';
import './App.scss';
import { PostList, PostEdit } from './pages/Post';

function App() {
    return (
        <HashRouter>
            <div className="app">
                <Routes>
                    <Route path="/" element={<DefaultLayout />}>
                        <Route path="/" element={<PostList />}></Route>
                        <Route path="/posts/new" element={<PostEdit />}></Route>
                        <Route path="/posts/:id" element={<PostEdit />}></Route>
                    </Route>
                </Routes>
            </div>
        </HashRouter>
    );
}

export default App;
