import { assets } from '../../assets/assets'
import './footer.css'

const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className='footer-content'>
                <div className='footer-content-left'>
                    <img src={assets.logo} alt='' />
                    <p>Get your favorite meals delivered right to your doorstep with just a few clicks! Whether you're craving pizza, sushi, or a healthy salad, we've got you covered. Fast, reliable, and delicious – order now!</p>
                    <div className='footer-social-icons'>
                        <a href="https://www.facebook.com" >
                            <img src={assets.facebook_icon} alt="Facebook" />
                        </a>
                        <a href="https://www.twitter.com">
                            <img src={assets.twitter_icon} alt="Twitter" />
                        </a>
                        <a href="https://www.linkedin.com">
                            <img src={assets.linkedin_icon} alt="LinkedIn" />
                        </a>


                    </div>
                </div>
                <div className='footer-content-center'>
                    <h2>COMPANY</h2>
                    <ul>
                        <li>HOME</li>
                        <li>ABOUT US</li>
                        <li>DELIVERY</li>
                        <li>PRIVACY POLICY</li>

                    </ul>
                </div>
                <div className='footer-content-right'>
                    <h2>GET IN TOUCH</h2>
                    <ul>
                        <li>+91 1234567890</li>
                        <li>contact@TOMATO.COM</li>
                    </ul>
                </div>
            </div>
            <hr />
            <p className='footer-copyright'>Copyright 2024 © TOMATO.COM. ALL RIGHTS RESERVED.</p>
        </div>
    )
}

export default Footer
