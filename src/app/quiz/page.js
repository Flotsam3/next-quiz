"use client";

import { useEffect, useState } from "react";
import { getUsers } from "../api";
import "./page.scss";
import questionData from "../../../json/data.json" assert { type: "json" };
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Sortable from "./Sortable";

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
   const [solutionClass, setSolutionClass] = useState("solution");
   const [solutionStyle, setSolutionStyle] = useState(null);
   const [initeSolution, setIniteSolution] = useState(false);
   const [answer, setAnswer] = useState([{ solution: "", rank: null, score: 0 }]);

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
      // if (barText.length > 0) {
      //    countdown();
      // }
      console.log({ barText });
   }, [barText]);

   useEffect(() => {
      if (myTimer <= 1) {
         console.log({ myTimer });
         validateAnswers();
      }
   }, [solutionStyle]);

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
      countdown();
   };

   const handleRotateCard = () => {
      console.log("handleRotateCard");
      if (cardClass === "card__content card--rotate") {
         setSolutionStyle(null);
         setTimeout(() => {
            setCardClass("card__content");
         }, 300);
         console.log("inside if");

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
         setSolutionStyle(null);
         setSolutionClass("solution");
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
            console.log("before solution");
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
      setSolutionStyle({ visibility: "visible" });
      setSolutionClass("solution solution--slide");
      setButtonCardDisabled(false);
      console.log({ solutionArr });
   };

   function validateAnswers() {
      let score = 0;
      const validation = barText.map((text, index) => {
         if (text === questionData[round].options[index]) {
            score += 5;
            return { solution: questionData[round].solutions[index], rank: index + 1, score: 5 };
         }
         const solutionIndex = questionData[round].options.indexOf(text);
         return { solution: questionData[round].solutions[solutionIndex], rank: solutionIndex + 1, score: 0 };
      });
      console.log("validation, score", [...validation, score]);
      setAnswer([...validation, score]);
      setButtonCard("button-card-active");
      setButtonCardStyle(null);
   }

   const handleDragEnd = (event) => {
      console.log("Drag end called");
      const { active, over } = event;

      if (active.id != over.id && myTimer > 0) {
         setBarText((text) => {
            const activeIndex = text.indexOf(active.id);
            const overIndex = text.indexOf(over.id);

            return arrayMove(text, activeIndex, overIndex);
         });
      }
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
                  <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                     <div className={answer[5] === 25 ? "card__back full-house" : "card__back"}>
                        <SortableContext items={barText} strategy={verticalListSortingStrategy}>
                           {barText.map((text, index) => (
                              <Sortable key={index} text={text} solutionClass={solutionClass} solutionStyle={solutionStyle} answer={answer} index={index} />
                           ))}
                        </SortableContext>
                     </div>
                  </DndContext>
               </div>
            </div>
            <button id="button-card" className={buttonCard} style={buttonCardStyle} disabled={buttonCardDisabled} onClick={handleRotateCard}>
               OK
            </button>
         </section>
      </>
   );
}
