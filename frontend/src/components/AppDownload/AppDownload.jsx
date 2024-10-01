// src/components/AppDownload/AppDownload.jsx
import { assets } from '../../assets/assets';
import './appDownload.css';

const AppDownload = () => {
    return (
        <div className='app-download' id='app-download'>
            <p>For Better Experience Download<br/> Tomato App</p>
            <div className='app-download-platform'>
                <img src={assets.play_store} alt='Google Play Store' />
                <img src={assets.app_store} alt='Apple App Store' />
            </div>
        </div>
    );
}

export default AppDownload;
