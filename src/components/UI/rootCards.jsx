// src/components/RootCards.jsx
import React from 'react';
import './RootCards.css';
import {Form, Link} from "react-router-dom";
import {TaskList} from "iconoir-react/regular"; // Импорт стилей

export default function RootCards({user}) {
    return (
        <div>
            <section className="cards-wrapper">
                {user !== null ? (
                    <>
                        <div className="card-grid-space">
                        <Link to='/tasks' className="card" href="https://codetheweb.blog/2017/10/06/html-syntax/" style={{ '--bg-img': 'url(https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&resize_w=1500&url=https://codetheweb.blog/assets/img/posts/html-syntax/cover.jpg)' }}>
                            <div>
                                <h1>Задачи</h1>
                                <p>Текстовые задачи с ответом.</p>

                            </div>
                        </Link>
                        </div>
                        <div className="card-grid-space">

                            <Link to='/cards' className="card" href="https://codetheweb.blog/2017/10/09/basic-types-of-html-tags/" style={{ '--bg-img': 'url(https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&resize_w=1500&url=https://codetheweb.blog/assets/img/posts/basic-types-of-html-tags/cover.jpg)' }}>
                                <div>
                                    <h1>Карточки</h1>
                                    <p>Тесты, контрольные работы. Составлены из задач.</p>

                                </div>
                            </Link>
                        </div>
                        <div className="card-grid-space">

                        <Link to='/problems' className="card" href="https://codetheweb.blog/2017/10/14/links-images-about-file-paths/" style={{ '--bg-img': 'url(https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&resize_w=1500&url=https://codetheweb.blog/assets/img/posts/links-images-about-file-paths/cover.jpg)' }}>
                    <div>
                        <h1>Проблемы</h1>
                        <p>Задачи, для решения которых нужно написать программу и пройти ряд тестов.</p>
                    </div>
                </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="card-grid-space">
                            <Link to='/login' className="card" href="https://codetheweb.blog/2017/10/06/html-syntax/"
                                  style={{'--bg-img': 'url(https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&resize_w=1500&url=https://codetheweb.blog/assets/img/posts/html-syntax/cover.jpg)'}}>
                                <div>
                                    <h1>Вход</h1>
                                    <p>Если у вас уже есть аккаунт</p>

                                </div>
                            </Link>
                        </div>
                        <div className="card-grid-space">

                            <Link to='/registration' className="card"
                                  href="https://codetheweb.blog/2017/10/09/basic-types-of-html-tags/"
                                  style={{'--bg-img': 'url(https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&resize_w=1500&url=https://codetheweb.blog/assets/img/posts/basic-types-of-html-tags/cover.jpg)'}}>
                                <div>
                                    <h1>Регистрация</h1>
                                    <p>Если вы новый пользователь</p>

                                </div>
                            </Link>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}