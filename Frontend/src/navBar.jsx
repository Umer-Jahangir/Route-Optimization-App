import React from 'react';

const Sidebar = () => {
  return (
    <aside
      className="bg-light border-end p-3"
      style={{
        width: '250px',
      }}
    >
      <a
        href="/"
        className="d-flex align-items-center mb-4 text-decoration-none"
      >
        <i className="bi bi-bootstrap fs-2 me-2 text-primary"></i>
        <span className="fs-4 fw-bold text-dark">ROUTE-OPTI</span>
      </a>
     <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <a href="#" className="nav-link text-dark">
            <i className="bi bi-house-door me-2"></i> Home
          </a>
        </li>
        <li>
          <a href="#" className="nav-link text-dark">
            <i className="bi bi-speedometer2 me-2"></i> Dashboard
          </a>
        </li>
        <li>
          <a href="#" className="nav-link text-dark">
            <i className="bi bi-table me-2"></i> Orders
          </a>
        </li>
        <li>
          <a href="#" className="nav-link text-dark">
            <i className="bi bi-grid me-2"></i> Notifications
          </a>
        </li>
        <li>
          <a href="#" className="nav-link text-dark">
            <i className="bi bi-person-circle me-2"></i> History
          </a>
        </li>
      </ul>

      <hr />

      <div className="dropdown">
        <a
          href="#"
          className="d-flex align-items-center text-decoration-none dropdown-toggle"
          id="profileDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            src="https://github.com/mdo.png"
            alt="Profile"
            width="32"
            height="32"
            className="rounded-circle me-2"
          />
          <strong className="text-dark">Account</strong>
        </a>
        <ul className="dropdown-menu text-small shadow" aria-labelledby="profileDropdown">
          <li><a className="dropdown-item" href="#">New project...</a></li>
          <li><a className="dropdown-item" href="#">Settings</a></li>
          <li><a className="dropdown-item" href="#">Profile</a></li>
          <li><hr className="dropdown-divider" /></li>
          <li><a className="dropdown-item" href="#">Sign out</a></li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
