"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getUsers, saveScore } from "../api";
import Image from "next/image";
import medal from "../../../public/images/medal.svg";
import grip from "../../../public/images/grip-lines.svg";
import "./page.scss";
import questionData from "../../../json/data.json" assert { type: "json" };
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Sortable from "./Sortable";

export default function Page() {
   const audio = new Audio("audio/5-sec-countdown.mp3");
   const router = useRouter();
   const [data, setData] = useState([]);
   const [user, setUser] = useState({});
   const [roundText, setRoundText] = useState("");
   const [round, setRound] = useState(0);
   const [buttonCard, setButtonCard] = useState("button-card-active");
   const [buttonCardDisabled, setButtonCardDisabled] = useState(false);
   const [buttonCardStyle, setButtonCardStyle] = useState(null);
   const [infoText, setInfoText] = useState("Get ready to start");
   const [barText, setBarText] = useState([]);
   const [cardClass, setCardClass] = useState("card__content");
   const [cardBackClass, setCardBackClass] = useState("card__back");
   const [playerScore, setPlayerScore] = useState(0);
   const [jsScore, setJsScore] = useState(0);
   const [finishedQuiz, setFinishedQuiz] = useState(false);
   const [bookStyle, setBookStyle] = useState(null);
   const [medal1Class, setMedal1Class] = useState("medal1 hidden");
   const [medal2Class, setMedal2Class] = useState("medal2 hidden");
   const [medal3Class, setMedal3Class] = useState("medal3 hidden");
   const [myTimer, setMyTimer] = useState();
   const [myTimerStyle, setMyTimerStyle] = useState(null);
   const [solutionClass, setSolutionClass] = useState("solution");
   const [solutionStyle, setSolutionStyle] = useState(null);
   const [highScoresClass, setHighScoresClass] = useState("high-scores");
   const [answer, setAnswer] = useState([{ solution: "", rank: null, score: 0 }]);
   const jsAnswer = useRef(0);

   useEffect(() => {
      const reload = sessionStorage.getItem("status");
      if (reload === "started") router.push("/");
      console.log({ reload });
      (async () => {
         const users = await getUsers();
         const sortedUsers = users.result.sort((a, b) => {
            return b.score - a.score;
         });
         const topUsers = sortedUsers.slice(0, 10);
         setData(topUsers);
      })();
      setUser(JSON.parse(sessionStorage.getItem("user")));
   }, []);

   useEffect(() => {
      setInfoText(`Get ready to start ${user.name}`);
   }, [user]);

   useEffect(() => {
      if (solutionStyle) {
         validateAnswers();
      }
   }, [solutionStyle]);

   const handleSlideScoreboard = () => {
      if (highScoresClass === "high-scores" || highScoresClass === "high-scores slide-scores-out") {
         setHighScoresClass("high-scores slide-scores-in");
      } else {
         setHighScoresClass("high-scores slide-scores-out");
      }
   };

   const handleShowExerciseInfo = () => {
      setInfoText(questionData[round].text);
      setRoundText(`${round + 1} | ${questionData.length}`);
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
         selectionComputer.push(rankIndexComputer[randomNumberComputer]); // fill array with random numbers for the computer answers
         rankIndex.splice(randomNumber, 1);
         rankIndexComputer.splice(randomNumberComputer, 1);
         jsAnswer.current = selectionComputer;
      }
      setBarText(_barText);
      countdown();
   };

   const handleRotateCard = async () => {
      if (cardClass === "card__content card--rotate") {
         setSolutionStyle(null);
         setTimeout(() => {
            setCardClass("card__content");
         }, 300);

         if (round + 1 === questionData.length) {
            // If quiz is finished
            const averageScore = playerScore / questionData.length;
            const medalOne = (questionData.length * 25 * 33) / 100;
            const medalTwo = (questionData.length * 25 * 66) / 100;
            // setHighscores();
            setFinishedQuiz(true);
            setBookStyle({ display: "none" });
            setButtonCardStyle({ visibility: "hidden" });
            setInfoText(`You made it to the last question and just finished the quiz! Your average score was ${averageScore} points.`);
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
            await saveScore({ id: user._id, score: playerScore, rounds: round + 1 });
            const updatedData = await getUsers();
            const sortedUsers = updatedData.result.sort((a, b) => {
               return b.score - a.score;
            });
            const topUsers = sortedUsers.slice(0, 10);
            setData(topUsers);
         } else {
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

   const resetCard = () => {
      setRound(round + 1);
      setInfoText(`Get ready for round ${round + 2}`);
      setCardBackClass("card__back");
   };

   const countdown = () => {
      const levels = { easy: 45, fair: 30, challenging: 20 };
      let myTime = levels[user.level];

      const myCountdown = setInterval(() => {
         if (myTime === 5) {
            setMyTimerStyle({ color: "#e44803" });
            audio.play();
            audio.volume = 0.1;
         }
         setMyTimer(myTime);
         myTime--;
         if (myTime < 0) {
            clearInterval(myCountdown);
            showSolution();
            sessionStorage.setItem("status", "started");
         }
      }, 1000);
   };

   const showSolution = () => {
      setSolutionStyle({ visibility: "visible" });
      setSolutionClass("solution solution--slide");
      setButtonCardDisabled(false);
   };

   function validateAnswers() {
      let score = 0;
      let _jsScore = 0;
      const validation = barText.map((text, index) => {
         if (jsAnswer.current[index] === index) _jsScore += 5;
         if (text === questionData[round].options[index]) {
            score += 5;
            return { solution: questionData[round].solutions[index], rank: index + 1, score: 5 };
         }
         const solutionIndex = questionData[round].options.indexOf(text);
         return { solution: questionData[round].solutions[solutionIndex], rank: solutionIndex + 1, score: 0 };
      });
      if (score === 25) {
         setCardBackClass("card__back full-house");
      }
      setAnswer([...validation, score]);
      setButtonCard("button-card-active");
      setButtonCardStyle(null);
      setPlayerScore(playerScore + score);
      setJsScore(jsScore + _jsScore);
   }

   const handleDragEnd = (event) => {
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
                     {jsScore}
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
            <div className={highScoresClass}>
               <h2>Leaderboard</h2>
               <div className="divider"></div>
               <div className="high-scores__names">
                  {data.map((user, index) => (
                     <div key={index} className="scoresContainer">
                        <div className="wrapperLeft">
                           <p>{user.name}</p>
                           <p>
                              {user.level}, rounds: {user.rounds}
                           </p>
                        </div>
                        <div className="wrapperright">
                           <p>{user.score}</p>
                        </div>
                     </div>
                  ))}
               </div>
               <button className="high-scores__grabber" onClick={handleSlideScoreboard}>
                  <i className="fas fa-grip-lines-vertical">
                     <Image src={grip} alt="scoreboard handle" />
                  </i>
               </button>
            </div>
            <div className="card">
               <div className={cardClass}>
                  <div className="card__front">
                     <div className={medal1Class}>
                        <i className="fas fa-medal">
                           <Image src={medal} alt="medal" />
                        </i>
                     </div>
                     <div className={medal2Class}>
                        <i className="fas fa-medal">
                           <Image src={medal} alt="medal" />
                        </i>
                     </div>
                     <div className={medal3Class}>
                        <i className="fas fa-medal">
                           <Image src={medal} alt="medal" />
                        </i>
                     </div>
                     <div className="book" style={bookStyle}>
                        <i className="fas fa-book-open"></i>
                     </div>
                  </div>
                  <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                     <div className={cardBackClass}>
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
