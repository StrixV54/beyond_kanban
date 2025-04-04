import React from "react";
import AvatarIcon from "../assets/avatar.png";
import Logo from "../assets/logo.svg";
import MailIcon from "../assets/mail.svg";
import BellIcon from "../assets/bell.svg";

const Header = () => {
    return (
        <header className="header">
            <div className="header-container">
                <div className="logo" aria-label="logo">
                    <img src={Logo} alt="logo" className="logo-icon" />
                </div>

                <div className="user-section">
                    <div className="notification-icons">
                        <button className="icon-button">
                            <img src={MailIcon} alt="mail" aria-label="mail icon" />
                        </button>
                        <button className="icon-button">
                            <img src={BellIcon} alt="bell" aria-label="bell icon" />
                        </button>
                    </div>

                    <div className="user-profile" aria-label="user profile">
                        <div className="avatar">
                            <img className="avatar-placeholder" src={AvatarIcon} alt="avatar" />
                        </div>
                        <div className="user-info">
                            <div className="user-name">Alexandra C.</div>
                            <div className="user-role">Designer</div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
