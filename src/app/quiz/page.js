import "./page.scss";

export default function page() {
   return (
      <>
         <header className="header">
            <div className="score">
               <div className="player">
                  <div id="player-value" className="player-value">
                     0
                  </div>
                  <p className="player-badge">You</p>
               </div>
               <div className="comp">
                  <div id="comp-value" className="comp-value">
                     0
                  </div>
                  <p className="comp-badge">JS</p>
               </div>
            </div>
            <div className="info">
               <p></p>
            </div>
            <div className="timer">
               <span className="countdown"></span>
               <span className="round"></span>
            </div>
         </header>

         <section className="main">
            <div className="high-scores">
               <h2>Leaderboard</h2>
               <div className="divider"></div>
               <div className="high-scores__names"></div>
               <div className="high-scores__points"></div>
               <button className="high-scores__grabber">
                  <i className="fas fa-grip-lines-vertical"></i>
               </button>
            </div>
            <div className="card">
               <div className="card__content">
                  <div className="card__front">
                     <div className="medal1 hidden">
                        <i className="fas fa-medal"></i>
                     </div>
                     <div className="medal2 hidden">
                        <i className="fas fa-medal"></i>
                     </div>
                     <div className="medal3 hidden">
                        <i className="fas fa-medal"></i>
                     </div>
                     <div className="book">
                        <i className="fas fa-book-open"></i>
                     </div>
                  </div>
                  <div className="card__back">
                     <div className="bar draggable" draggable="true">
                        {" "}
                        <span className="solution">
                           {" "}
                           <span className="number"></span>
                        </span>
                     </div>
                     <div className="bar draggable" draggable="true">
                        {" "}
                        <span className="solution">
                           {" "}
                           <span className="number"></span>
                        </span>
                     </div>
                     <div className="bar draggable" draggable="true">
                        {" "}
                        <span className="solution">
                           {" "}
                           <span className="number"></span>
                        </span>
                     </div>
                     <div className="bar draggable" draggable="true">
                        {" "}
                        <span className="solution">
                           {" "}
                           <span className="number"></span>
                        </span>
                     </div>
                     <div className="bar draggable" draggable="true">
                        {" "}
                        <span className="solution">
                           {" "}
                           <span className="number"></span>
                        </span>
                     </div>
                  </div>
               </div>
            </div>
            <button id="button-card" className="button-card-active">
               OK
            </button>
         </section>
      </>
   );
}
