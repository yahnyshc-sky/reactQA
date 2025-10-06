import {NavLink} from 'react-router';
import logo from '../../assets/qalogo.svg';

function Header() {
    return (
        <header>
            <nav className="navbar navbar-expand-md" style={{ backgroundColor: "#14EAB8" }}>
                <a
                    className="navbar-brand d-flex align-items-center"
                    href="https://www.qa.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img src={logo} alt="QA Ltd" width="100" className="qa-logo me-2" />
                </a>

                <h1 className="navbar-brand">
                    Todo App
                </h1>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto">
                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    isActive ? "nav-link active" : "nav-link"
                                }
                            >
                                All Todos
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/add"
                                className={({ isActive }) =>
                                    isActive ? "nav-link active" : "nav-link"
                                }
                                data-testid="addTodoLink"
                            >
                                Add Todo
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}

export default Header;
