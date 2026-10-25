import React, { useEffect, useRef, useState } from "react";
const API = "http://localhost:5000";
function Cover({track}) { return <div className={`cover ${track?.cover || "sunset"}`}><span>♫</span></div>; }

export default function App() {
  const [tracks,setTracks] = useState([]);
  const [query,setQuery] = useState("");
  const [current,setCurrent] = useState(null);
  const [playing,setPlaying] = useState(false);
  const [volume,setVolume] = useState(70);
  const [notice,setNotice] = useState("");
  const audio = useRef(null);

  useEffect(() => {
    fetch(`${API}/api/tracks`).then(r => {if(!r.ok) throw new Error(); return r.json();})
      .then(setTracks).catch(() => setNotice("Cannot reach Node API. Start the backend on port 5000."));
  },[]);
  useEffect(() => { if(audio.current) audio.current.volume = volume/100; },[volume]);

  const visible = tracks.filter(t => `${t.title} ${t.artist} ${t.album} ${t.genre}`.toLowerCase().includes(query.toLowerCase()));
  function play(track) {
    setCurrent(track); setPlaying(true);
    setTimeout(() => audio.current?.play().catch(() => setPlaying(false)), 80);
  }
  function toggle() {
    if(!current) { if(tracks[0]) play(tracks[0]); return; }
    if(playing) { audio.current?.pause(); setPlaying(false); }
    else audio.current?.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }
  function next() {
    if(!tracks.length) return;
    const i = tracks.findIndex(t => t.id === current?.id);
    play(tracks[(i+1+tracks.length)%tracks.length]);
  }
  async function recommendations() {
    try {
      const r = await fetch(`${API}/api/recommendations`); const data = await r.json();
      if(!r.ok) throw new Error();
      const ids = data.tracks.map(t => t.id);
      setTracks(old => [...old].sort((a,b) => ids.indexOf(a.id)-ids.indexOf(b.id)));
      setNotice(data.reason);
    } catch { setNotice("Start the Python recommendation service on port 5001 to use For You."); }
  }
  function allSongs() {
    setNotice("");
    fetch(`${API}/api/tracks`).then(r=>r.json()).then(setTracks).catch(()=>{});
  }

  return <div className="layout">
    <aside className="sidebar">
      <div className="brand"><span className="brandIcon">♫</span> melody<span>hub</span></div>
      <button className="sideLink active" onClick={allSongs}>⌂　 Home</button>
      <label className="search"><span>⌕</span><input placeholder="Search songs, albums..." value={query} onChange={e=>setQuery(e.target.value)} /></label>
      <button className="sideLink" onClick={()=>document.getElementById("songs")?.scrollIntoView({behavior:"smooth"})}>▤　 Your Library</button>
      <p className="sideTitle">YOUR COLLECTION</p>
      <button className="sideLink" onClick={recommendations}>✦　 For You</button>
      <button className="sideLink" onClick={allSongs}>♫　 All Songs</button>
      <div className="sidebarFoot"><div>♫</div><p><b>Music for every mood</b><small>A little demo, a lot of vibe.</small></p></div>
    </aside>
    <main>
      <header><div className="backBtns"><button>‹</button><button>›</button></div><div className="profile"><span className="liveDot"></span> DEMO PLAYER <b>M</b></div></header>
      <section className="hero">
        <div className="heroText"><p className="kicker">YOUR SOUNDTRACK STARTS HERE</p><h1>Find your<br/><em>next favorite.</em></h1>
          <p className="desc">A little rhythm for your routine. Explore the collection and find the sound that fits your moment.</p>
          <button className="primary" onClick={()=>visible[0]&&play(visible[0])}>▶　Start listening</button>
        </div>
        <div className="record"><div className="recordArt">♫</div></div><div className="floating">✦　 <span><b>Now playing</b><small>Your next good mood</small></span></div>
      </section>
      {notice && <div className="notice">{notice}</div>}
      <section className="section">
        <div className="sectionHead"><div><p className="kicker">MADE FOR YOU</p><h2>Pick up your vibe</h2></div><button className="plainBtn" onClick={recommendations}>Explore recommendations ↗</button></div>
        <div className="vibes">
          <button className="vibe chill" onClick={()=>setQuery("Chill")}><span>☁</span><small>TAKE IT EASY</small><b>Chill moments</b></button>
          <button className="vibe energy" onClick={()=>setQuery("Electronic")}><span>ϟ</span><small>TURN IT UP</small><b>Energy boost</b></button>
          <button className="vibe focus" onClick={()=>setQuery("Instrumental")}><span>◉</span><small>LOCK IN</small><b>Deep focus</b></button>
        </div>
      </section>
      <section className="section" id="songs">
        <div className="sectionHead"><div><p className="kicker">THE COLLECTION</p><h2>{query ? `Results for “${query}”` : "Popular right now"}</h2></div><button className="plainBtn" onClick={allSongs}>Show all</button></div>
        <div className="tableHead"><span>#</span><span>TRACK</span><span>ALBUM</span><span>GENRE</span><span></span></div>
        {visible.map((t,i)=><div className={`song ${current?.id===t.id?"chosen":""}`} key={t.id}>
          <span className="number">{String(i+1).padStart(2,"0")}</span><div className="songName"><Cover track={t}/><div><b>{t.title}</b><small>{t.artist}</small></div></div>
          <span className="album">{t.album}</span><span className="genre">{t.genre}</span>
          <button className="playRow" onClick={()=>current?.id===t.id?toggle():play(t)}>{current?.id===t.id&&playing?"Ⅱ":"▶"}</button>
        </div>)}
        {!visible.length && <p className="empty">No songs found. Try another search.</p>}
      </section>
      <footer><b>♫ melodyhub</b><span>Made for learning · Music-player demo</span></footer>
    </main>
    <div className="player">
      <div className="nowTrack">{current?<Cover track={current}/>:<div className="cover placeholder">♫</div>}<div><b>{current?.title||"Choose a track"}</b><small>{current?.artist||"Your soundtrack awaits"}</small></div><button className="heart" onClick={e=>e.currentTarget.classList.toggle("liked")}>♡</button></div>
      <div className="controls"><div><button onClick={next}>|‹</button><button className="playMain" onClick={toggle}>{playing?"Ⅱ":"▶"}</button><button onClick={next}>»</button></div><div className="progress"><span>0:00</span><i><b className={playing?"progressActive":""}></b></i><span>{current?.duration||"0:12"}</span></div></div>
      <div className="volume"><span>🔊</span><input aria-label="Volume" type="range" min="0" max="100" value={volume} onChange={e=>setVolume(+e.target.value)}/></div>
    </div>
    <audio ref={audio} src={current?.audio} onEnded={next} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)}/>
  </div>;
}
