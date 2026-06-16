import './style.css';

import WindowManager from './kernel/WindowManager.js';
import FileSystem from './kernel/FileSystem.js';

import { auth } from './firebase/firebase.js';

import Explorer from "./apps/Explorer.js";
import Notepad from "./apps/Notepad.js";
import AIAssistant from "./apps/AIAssistant.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged
}
from "firebase/auth";

import Terminal from "./apps/Terminal.js";


// ---------- 로그인 화면 ----------
function renderLogin(){

    document.querySelector('#app').innerHTML = `

    <div id="login-screen">

        <h2>WebOS Login</h2>

        <input
            id="email"
            placeholder="Email"
        >

        <br><br>

        <input
            id="password"
            type="password"
            placeholder="Password"
        >

        <br><br>

        <button id="register">
            회원가입
        </button>

        <button id="login">
            로그인
        </button>

    </div>

    `;


    // 회원가입
    document
        .getElementById("register")
        .addEventListener(
            "click",
            async ()=>{

                const email =
                    document.getElementById("email").value;

                const password =
                    document.getElementById("password").value;

                try{

                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );

                    alert("회원가입 성공");

                }

                catch(error){

                    alert(error.message);

                }

            }
        );


    // 로그인
    document
        .getElementById("login")
        .addEventListener(
            "click",
            async ()=>{

                const email =
                    document.getElementById("email").value;

                const password =
                    document.getElementById("password").value;

                try{

                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );

                }

                catch(error){

                    alert(error.message);

                }

            }
        );

}



// ---------- WebOS ----------

function renderDesktop(){

    document.querySelector('#app').innerHTML = `

    <div id="desktop">

        <div id="desktop-icons">

            <div class="icon" id="explorer-icon">
                📁
                <span>Explorer</span>
            </div>

            <div class="icon" id="ai-icon">
                🤖
                <span>AI</span>
            </div>

            <div class="icon" id="notepad-icon">
                📝
                <span>Notepad</span>
            </div>

            <div class="icon" id="terminal-icon">
                💻
                <span>Terminal</span>
            </div>

        </div>


        <div
            id="start-menu"

            style="
                display:none;
                position:fixed;
                bottom:40px;
                left:0;
                width:220px;
                background:#2b2b2b;
                color:white;
                padding:10px;
                border-top-right-radius:8px;
            "
        >

            <div id="menu-explorer">
                📁 Explorer
            </div>

            <br>

            <div id="menu-terminal">
                💻 Terminal
            </div>

            <br>

            <div id="menu-notepad">
                📝 Notepad
            </div>

            <br>

            <div id="menu-ai">
                🤖 AI
            </div>

            <br>

            <div id="menu-shutdown">
                ⛔ Shutdown
            </div>

        </div>


        <div id="taskbar">

            <div id="start-button">
                WebOS
            </div>

        </div>

    </div>

    `;


    const wm =
        new WindowManager();

    const fs =
        new FileSystem();

    const explorer =
        new Explorer(
            fs,
            wm,
            auth
        );

    const notepad =
        new Notepad(
            wm
        );

    const ai =
        new AIAssistant(
            wm,
            explorer,
            notepad
        );

    const terminal =
        new Terminal(
            fs,
            wm,
            auth
        );


    // explorer
    document
        .getElementById(
            "explorer-icon"
        )
        .addEventListener(
            "dblclick",
            ()=>{
                explorer.open();
            }
        );


    // terminal
    document
        .getElementById(
            "terminal-icon"
        )
        .addEventListener(
            "dblclick",
            ()=>{
                terminal.open();
            }
        );


    // ai
    document
        .getElementById(
            "ai-icon"
        )
        .addEventListener(
            "dblclick",
            ()=>{
                ai.open();
            }
        );


    // notepad
    document
        .getElementById(
            "notepad-icon"
        )
        .addEventListener(
            "dblclick",
            ()=>{
                notepad.open();
            }
        );


    // start menu toggle
    document
        .getElementById(
            "start-button"
        )
        .addEventListener(
            "click",
            ()=>{

                const menu =
                    document.getElementById(
                        "start-menu"
                    );

                if(
                    menu.style.display ===
                    "none"
                ){

                    menu.style.display =
                        "block";

                }

                else{

                    menu.style.display =
                        "none";

                }

            }
        );


    // start menu explorer
    document
        .getElementById(
            "menu-explorer"
        )
        .addEventListener(
            "click",
            ()=>{

                explorer.open();

            }
        );


    // start menu terminal
    document
        .getElementById(
            "menu-terminal"
        )
        .addEventListener(
            "click",
            ()=>{

                terminal.open();

            }
        );


    // start menu ai
    document
        .getElementById(
            "menu-ai"
        )
        .addEventListener(
            "click",
            ()=>{

                ai.open();

            }
        );


    // start menu notepad
    document
        .getElementById(
            "menu-notepad"
        )
        .addEventListener(
            "click",
            ()=>{

                notepad.open();

            }
        );


    // shutdown
    document
        .getElementById(
            "menu-shutdown"
        )
        .addEventListener(
            "click",
            ()=>{

                alert(
                    "WebOS shutting down..."
                );

                location.reload();

            }
        );


    fs.initialize(
        auth.currentUser.uid
    );

}



