import { lazy, Suspense } from 'react';
import {
    Routes,
    Route,
    unstable_HistoryRouter as HistoryRouter,
} from 'react-router-dom';
import { PostList, PostEdit } from './pages/Post';
import { RoutingGuard } from '@/components/RoutingGuard.js';
import { history } from '@/utils';

import './App.scss';

const Login = lazy(() => import('./pages/Login'));
const DefaultLayout = lazy(() => import('./pages/Layout'));
const NewAccount = lazy(() => import('./pages/NewAccount'));

function App() {
    return (
        <HistoryRouter history={history}>
            <div className="app">
                <Suspense
                    fallback={
                        <div style={{ textAlign: 'center', marginTop: 200 }}>
                            Loading.....
                        </div>
                    }
                >
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <RoutingGuard>
                                    <DefaultLayout />
                                </RoutingGuard>
                            }
                        >
                            <Route
                                index
                                path="/"
                                element={<PostList />}
                            ></Route>
                            <Route
                                path="/posts/new"
                                element={<PostEdit />}
                            ></Route>
                            <Route
                                path="/posts/:id"
                                element={<PostEdit />}
                            ></Route>
                        </Route>
                        <Route path="/login" element={<Login />}></Route>
                        <Route
                            path="/accounts/new"
                            element={<NewAccount />}
                        ></Route>
                    </Routes>
                </Suspense>
            </div>
        </HistoryRouter>
    );
}

export default App;
