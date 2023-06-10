"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// import Image from "next/image";
import "./page.scss";
import { createUser, getUsers } from "./api";

export default function Home() {
   const router = useRouter();
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
   const [pane, setPane] = useState(false);
   const [paneClass, setPaneClass] = useState("pane");
   const [buttonInfo, setButtonInfo] = useState({ visibility: "hidden" });
   // const [aTagClass, setATagClass] = useState(null);
   const [levelTime, setLevelTime] = useState("45");

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

   async function handleLevelButton() {
      switch (level) {
         case "easy":
            setLevelTime("45");
            break;
         case "fair":
            setLevelTime("30");
            break;
         case "challenging":
            setLevelTime("20");
      }

      setShowCube(false);
      setCubeTop(null);
      setScene("scene --fade-out");
      const user = await createUser({ name, level });
      sessionStorage.setItem("user", JSON.stringify(user.result));

      setTimeout(() => {
         setPane(true);
         setButtonInfo(null);
         setPaneClass("pane --fade-in");
         // setATagClass("--fade-in");
      }, 2000);
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
                              getUsers();
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
            <div className={paneClass}>
               <p style={{ whiteSpace: "pre-line" }}>
                  {pane
                     ? `Nice to have you here ${name}, 
                     
                     during this quiz you will be presented with five terms for each round and your task is to bring all of them into the right order by using drag and drop. Each correctly assigned term will earn you five points. 
                     
                     Your preferred level of difficulty is "${level}", therefore you have ${levelTime} seconds to accomplish each round. 
                     
                     Have fun!`
                     : null}
               </p>
            </div>
            <button id="button-info" style={buttonInfo} onClick={() => router.push("/quiz")}>
               OK
            </button>
         </section>
         <footer>
            <small style={startAnimation ? { visibility: "hidden" } : null}>&#169; (2020)</small>
         </footer>
      </>
   );
}
