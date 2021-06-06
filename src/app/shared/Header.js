import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import Api from '../../apis/Api'

export class Header extends Component {
  constructor() {
    super()
    this.state = {
      name : 'loading',
      number : '0000',
    }
  }
  closeMenu(e) {
    e.target.closest(".dropdown").classList.remove("show");
    e.target.closest(".dropdown .dropdown-menu").classList.remove("show");
  }

  toggleHeaderMenu(e) {
    e.preventDefault();
    document.querySelector("body").classList.toggle("az-header-menu-show");
  }
  componentWillMount(props) {
    Api('/hospital', {id : 1}).then(res => {
      if(res.status !== 200) {

      } else {
        this.setState({
          name : res.hospitalDTO.hospitalName,
          number : res.hospitalDTO.tel,
        })
      }
    })
  }
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      document.querySelector("body").classList.remove("az-header-menu-show");
    }    
  }

  render() {
    return (
      <div>
        <div className="az-header">
          <div className="container">
            <div className="az-header-left">
              <Link to="/" className="az-logo">
                <span></span> 인트인
                </Link>
              <a
                id="azMenuShow"
                onClick={event => this.toggleHeaderMenu(event)}
                className="az-header-menu-icon d-lg-none"
                href="#/"
              >
                <span></span>
              </a>
            </div>
            <div className="az-header-menu">
              <div className="az-header-menu-header">
                <Link to="/" className="az-logo">
                  <span></span> azia
                </Link>
                <a
                  href="#/"
                  onClick={event => this.toggleHeaderMenu(event)}
                  className="close"
                >
                  &times;
                </a>
              </div>
              <ul className="nav">
                <li
                  className={
                    this.isPathActive("/dashboard")
                      ? "nav-item active"
                      : "nav-item"
                  }>
                  <Link to="/dashboard" className="nav-link">
                    <i className="typcn typcn-chart-area-outline"></i> 환자목록
                  </Link>
                </li>
                <li
                  className={
                    this.isPathActive("/treatment")
                      ? "nav-item active"
                      : "nav-item"
                  }>
                  <Link to="/treatment" className="nav-link">
                    <i className="typcn typcn-chart-area-outline"></i> 진료목록
                  </Link>
                </li>
              </ul>
            </div>
            <div className="az-header-right">
            <a href="https://www.bootstrapdash.com/demo/azia-react-free/documentation/documentation.html" className="az-header-search-link">
                <i className="fas fa-file-alt"></i>
              </a>
              <a href="#/" className="az-header-search-link">
                <i className="fas fa-search"></i>
              </a>
              <div className="az-header-message">
                <Link to="#/">
                  <i className="typcn typcn-messages"></i>
                </Link>
              </div>
             
              <Dropdown className="az-profile-menu">
                <Dropdown.Toggle as={"a"} className="az-img-user">
                  <img
                    src={require("../../assets/images/img1.jpg")}
                    alt=""
                  ></img>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <div className="az-dropdown-header d-sm-none">
                    <a
                      href="#/"
                      onClick={event => this.closeMenu(event)}
                      className="az-header-arrow"
                    >
                      <i className="icon ion-md-arrow-back"></i>
                    </a>
                  </div>
                  <div className="az-header-profile">
                    <div className="az-img-user">
                      <img
                        src={require("../../assets/images/img1.jpg")}
                        alt=""
                      ></img>
                    </div>
                    <h6>{this.state.name}</h6>
                    <span>{this.state.number}</span>
                  </div>

                  <a href="#/" className="dropdown-item">
                    <i className="typcn typcn-user-outline"></i> My Profile
                  </a>
                  <a href="#/" className="dropdown-item">
                    <i className="typcn typcn-edit"></i> Edit Profile
                  </a>
                  <a href="#/" className="dropdown-item">
                    <i className="typcn typcn-time"></i> Activity Logs
                  </a>
                  <a href="#/" className="dropdown-item">
                    <i className="typcn typcn-cog-outline"></i> Account Settings
                  </a>
                  <Link to="/general-pages/signin" className="dropdown-item">
                    <i className="typcn typcn-power-outline"></i> Sign Out
                  </Link>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }
}

export default withRouter(Header);
