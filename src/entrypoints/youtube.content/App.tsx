import './style.css';

export default function App() {
  const handleClick = () => {
    console.log('YT-GIF: GIF button clicked');
  };

  return (
    <button className="yt-gif-button" onClick={handleClick}>
      <span className="yt-gif-icon">GIF</span>
    </button>
  );
}
