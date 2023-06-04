"use client";

import { useState } from "react";

// import Image from "next/image";
import "./page.scss";

export default function Home() {
   const [name, setName] = useState("");
   const [level, setLevel] = useState("easy");
   const [startAnimation, setStartAnimation] = useState(false);
   const [cubeClass, setCubeClass] = useState("cube");
   const [cubeRight, setCubeRight] = useState("cube__side cube__side--right");
   const [rect, setRect] = useState("");
   const [hint, setHint] = useState({ visibility: "hidden" });
   const [buttonSubmit, setButtonSubmit] = useState(null);
   const [cubeTop, setCubeTop] = useState(null);
   const [nameClass, setNameClass] = useState(null);
   const [showCube, setShowCube] = useState(true);
   const [scene, setScene] = useState("scene");

   function cubeTimeout() {
      setTimeout(() => {
         setCubeClass("cube right");
         setCubeRight("cube__side cube__side--right dynamic-border");
         setRect("dynamic-border");
      }, 500);
   }

   function handleSubmitName() {
      const regex = /^[a-zA-Z]{2,20}$/;
      if (regex.test(name)) {
         setButtonSubmit("button-disabled");
         setCubeTop("dynamic-border");
         setCubeClass("cube top");
      } else {
         setNameClass("name-check");
         setHint({ visibility: "visible" });
         setTimeout(() => {
            setNameClass(null);
         }, 1000);
      }
   }

   function handleLevelButton() {
      let levelTime = 0;

      switch (level) {
         case "easy":
            levelTime = 45;
            break;
         case "fair":
            levelTime = 30;
            break;
         case "challenging":
            levelTime = 20;
      }

      setShowCube(false);
      setCubeTop(null);
      setScene("scene --fade-out");
   }

   return (
      <>
         <section className="start">
            <h1>DaD Quizz Challenge</h1>
            <div className={scene}>
               <div className={cubeClass}>
                  {showCube && (
                     <div className="cube__side cube__side--front">
                        <svg>
                           <rect className={rect}></rect>
                        </svg>
                        <button
                           id="button-start"
                           className={startAnimation ? "button-disabled" : null}
                           onClick={() => {
                              setStartAnimation(true);
                              cubeTimeout();
                           }}
                        >
                           Start
                        </button>
                     </div>
                  )}
                  {showCube && <div className="cube__side cube__side--back">back</div>}
                  {showCube && (
                     <div className={cubeRight}>
                        <svg>
                           <rect className={rect}></rect>
                        </svg>
                        <input type="name" id="name" className={nameClass} placeholder="Enter your name" onChange={(evt) => setName(evt.target.value)} />
                        <span className="hint" style={hint}>
                           Please enter a valid name!
                        </span>
                        <button id="button-submit-name" className={buttonSubmit} onClick={handleSubmitName}>
                           OK
                        </button>
                     </div>
                  )}
                  {showCube && <div className="cube__side cube__side--left">left</div>}
                  <div className="cube__side cube__side--top">
                     <svg>
                        <rect className={cubeTop}></rect>
                     </svg>
                     <div className="level-selection">
                        <h4>Choose your level!</h4>
                        <label className="container">
                           easy
                           <input type="radio" name="level" id="easy" value="easy" checked={level === "easy"} onChange={(evt) => setLevel(evt.target.value)} />
                           <span className="checkmark"></span>
                        </label>
                        <label className="container">
                           fair
                           <input type="radio" name="level" id="fair" value="fair" checked={level === "fair"} onChange={(evt) => setLevel(evt.target.value)} />
                           <span className="checkmark"></span>
                        </label>
                        <label className="container">
                           challenging
                           <input type="radio" name="level" id="challenging" value="challenging" checked={level === "challenging"} onChange={(evt) => setLevel(evt.target.value)} />
                           <span className="checkmark"></span>
                        </label>
                     </div>
                     <button id="button-submit-level" onClick={handleLevelButton}>
                        OK
                     </button>
                  </div>
                  <div className="cube__side cube__side--bottom">bottom</div>
               </div>
            </div>
         </section>

         <section className="quiz-info">
            <div className="pane">
               <p></p>
            </div>
            <a href="main.html">
               <button id="button-info" style={{ visibility: "hidden" }}>
                  OK
               </button>
            </a>
         </section>
         <footer>
            <small style={startAnimation ? { visibility: "hidden" } : null}>&#169; (2020)</small>
         </footer>
      </>
   );
}
