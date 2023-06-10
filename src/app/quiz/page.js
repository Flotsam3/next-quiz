"use client";

import { useEffect, useState } from "react";
import { getUsers } from "../api";
import "./page.scss";
import questionData from "../../../json/data.json" assert { type: "json" };

export default function page() {
   const [data, setData] = useState([]);
   const [user, setUser] = useState({});
   const [roundText, setRoundText] = useState(questionData.length);
   const [round, setRound] = useState(0);
   const [buttonCard, setButtonCard] = useState("button-card-active");
   const [buttonCardDisabled, setButtonCardDisabled] = useState(false);
   const [buttonCardStyle, setButtonCardStyle] = useState(null);
   const [infoText, setInfoText] = useState("Get ready to start");
   const [barText, setBarText] = useState([]);
   const [cardClass, setCardClass] = useState("card__content");
   const [averageScore, setAverageScore] = useState(0);
   const [playerScore, setPlayerScore] = useState(0);
   const [finishedQuiz, setFinishedQuiz] = useState(false);
   const [bookStyle, setBookStyle] = useState(null);
   const [medal1Class, setMedal1Class] = useState("medal1 hidden");
   const [medal2Class, setMedal2Class] = useState("medal2 hidden");
   const [medal3Class, setMedal3Class] = useState("medal3 hidden");
   const [myTimer, setMyTimer] = useState();
   const [myTimerStyle, setMyTimerStyle] = useState(null);
   const [solution, setSolution] = useState([]);
   const [initeSolution, setIniteSolution] = useState(false);

   useEffect(() => {
      console.log({ questionData });
      (async () => {
         const users = await getUsers();
         setData(users.result);
      })();
      console.log("user", user);
      setUser(JSON.parse(sessionStorage.getItem("user")));
   }, []);

   useEffect(() => {
      setInfoText(`Get ready to start ${user.name}`);
   }, [user]);

   useEffect(() => {
      if (barText.length > 0) {
         countdown();
      }
   }, [barText]);

   const handleButtonCard = () => {};

   const handleSlideScoreboard = () => {};

   const handleShowExerciseInfo = () => {
      setInfoText(questionData[round].text);
      setRoundText(`${round + 1} | ${roundText}`);
      fillBars();
   };

   const fillBars = () => {
      let rankIndex = [0, 1, 2, 3, 4];
      let rankIndexComputer = [0, 1, 2, 3, 4];
      let selectionComputer = [];
      let randomNumber = 0;
      let randomNumberComputer = 0;
      const _barText = [];

      for (let i = 0; i < 5; i++) {
         randomNumber = Math.floor(Math.random() * rankIndex.length);
         randomNumberComputer = Math.floor(Math.random() * rankIndexComputer.length);
         _barText.push(questionData[round].options[rankIndex[randomNumber]]); // fill bars with terms
         console.log("test", questionData[round].options[rankIndex[randomNumber]]);
         selectionComputer.push(rankIndexComputer[randomNumberComputer]); // fill array with random numbers for the computer answers
         rankIndex.splice(randomNumber, 1);
         rankIndexComputer.splice(randomNumberComputer, 1);
      }
      console.log(_barText);
      setBarText(_barText);
   };

   const handleRotateCard = () => {
      if (cardClass === "card__content card--rotate") {
         setCardClass("card__content");

         if (round + 1 === questionData.length) {
            // If quiz is finished
            setAverageScore(playerScore / questionData.length);
            const medalOne = (questionData.length * 25 * 33) / 100;
            const medalTwo = (questionData.length * 25 * 66) / 100;
            // setHighscores();
            setFinishedQuiz(true);
            setBookStyle({ display: "none" });
            setButtonCardStyle({ visibility: "hidden" });
            setInfoText(`You did it, you just finished the quiz! You scored ${averageScore} points on average.`);
            if (playerScore < medalOne) {
               setMedal1Class("medal1");
            } else if (playerScore < medalTwo) {
               setMedal1Class("medal1");
               setMedal2Class("medal2");
            } else {
               setMedal1Class("medal1");
               setMedal2Class("medal2");
               setMedal3Class("medal3");
            }
            resetCard();
         }
      } else {
         setButtonCardDisabled(true);
         setButtonCard("button-card-disabled");
         handleShowExerciseInfo();
         setCardClass("card__content card--rotate");
      }
   };

   const countdown = () => {
      const levels = { easy: 45, fair: 30, challenging: 20 };
      let myTime = levels[user.level];

      const myCountdown = setInterval(() => {
         if (myTime === 5) {
            setMyTimerStyle({ color: "#e44803" });
            //  audio.play();
            //  audio.volume = 0.1;
         }
         setMyTimer(myTime);
         myTime--;
         if (myTime < 0) {
            clearInterval(myCountdown);
            //  barText.forEach((element)=>{
            //      element.setAttribute('draggable', 'false');
            //      element.classList.remove('draggable');
            //  });
            showSolution();
         }
      }, 1000);
   };

   const showSolution = () => {
      const solutionArr = barText.map((text, index) => {
         const answerIndex = questionData[round].options.indexOf(text);
         console.log({ answerIndex });
         const result = barText[answerIndex];
         console.log({ result });
         return result;
      });
      // setSolution(solutionArr);
      console.log({ solutionArr });
   };

   return (
      <>
         <header className="header">
            <div className="score">
               <div className="player">
                  <div id="player-value" className="player-value">
                     {playerScore}
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
               <p>{infoText}</p>
            </div>
            <div className="timer">
               <span className="countdown" style={myTimerStyle}>
                  {myTimer}
               </span>
               <span className="round">{roundText}</span>
            </div>
         </header>

         <section className="main">
            <div className="high-scores">
               <h2>Leaderboard</h2>
               <div className="divider"></div>
               <div className="high-scores__names"></div>
               <div className="high-scores__points"></div>
               <button className="high-scores__grabber" onClick={handleSlideScoreboard}>
                  <i className="fas fa-grip-lines-vertical"></i>
               </button>
            </div>
            <div className="card">
               <div className={cardClass}>
                  <div className="card__front">
                     <div className={medal1Class}>
                        <i className="fas fa-medal"></i>
                     </div>
                     <div className={medal2Class}>
                        <i className="fas fa-medal"></i>
                     </div>
                     <div className={medal3Class}>
                        <i className="fas fa-medal"></i>
                     </div>
                     <div className="book" style={bookStyle}>
                        <i className="fas fa-book-open"></i>
                     </div>
                  </div>
                  <div className="card__back">
                     <div className="bar draggable" draggable="true">
                        {barText[0]}
                        <span className="solution">
                           {" "}
                           <span className="number"></span>
                        </span>
                     </div>
                     <div className="bar draggable" draggable="true">
                        {barText[1]}
                        <span className="solution">
                           {" "}
                           <span className="number"></span>
                        </span>
                     </div>
                     <div className="bar draggable" draggable="true">
                        {barText[2]}
                        <span className="solution">
                           {" "}
                           <span className="number"></span>
                        </span>
                     </div>
                     <div className="bar draggable" draggable="true">
                        {barText[3]}
                        <span className="solution">
                           {" "}
                           <span className="number"></span>
                        </span>
                     </div>
                     <div className="bar draggable" draggable="true">
                        {barText[4]}
                        <span className="solution">
                           {" "}
                           <span className="number"></span>
                        </span>
                     </div>
                  </div>
               </div>
            </div>
            <button id="button-card" className={buttonCard} style={buttonCardStyle} disabled={buttonCardDisabled} onClick={handleRotateCard}>
               OK
            </button>
         </section>
      </>
   );
}
