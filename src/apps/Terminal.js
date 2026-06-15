export default class Terminal {

    constructor(
        fs,
        wm,
        auth
    ){

        this.fs = fs;
        this.wm = wm;
        this.auth = auth;

    }

    open(){

        const termWin =
            this.wm.createWindow(

                "Terminal",

                `

                <div
                    id="terminal-output"

                    style="
                        background:black;
                        color:lime;
                        height:300px;
                        overflow:auto;
                        padding:10px;
                        font-family:monospace;
                    "

                >

                    WebOS Terminal<br><br>

                </div>

                <input
                    id="terminal-input"

                    style="
                        width:100%;
                    "

                    placeholder="command..."
                >

                `
            );


        const output =
            termWin.querySelector(
                "#terminal-output"
            );


        const input =
            termWin.querySelector(
                "#terminal-input"
            );


        input.addEventListener(

            "keydown",

            async (e)=>{

                if(
                    e.key !== "Enter"
                ) return;


                const command =
                    input.value.trim();


                input.value = "";


                output.innerHTML +=
                    `> ${command}<br>`;


                const user =
                    this.auth.currentUser;


                // help
                if(
                    command === "help"
                ){

                    output.innerHTML +=
                    `
                    help<br>
                    ls<br>
                    mkdir [name]<br>
                    touch [name]<br>
                    clear<br><br>
                    `;

                    return;

                }


                // ls
                if(
                    command === "ls"
                ){

                    const files =
                        await this.fs.getNodes(
                            user.uid
                        );


                    files.forEach(

                        file=>{

                            output.innerHTML +=

                            file.type === "folder"

                            ?

                            `📁 ${file.name}<br>`

                            :

                            `📄 ${file.name}<br>`;

                        }

                    );

                    output.innerHTML +=
                        "<br>";

                    return;

                }


                // mkdir
                if(
                    command.startsWith(
                        "mkdir "
                    )
                ){

                    const folderName =
                        command.replace(
                            "mkdir ",
                            ""
                        );


                    await this.fs.createFolder(
                        user.uid,
                        folderName
                    );


                    output.innerHTML +=
                    `
                    folder created<br><br>
                    `;

                    return;

                }


                // touch
                if(
                    command.startsWith(
                        "touch "
                    )
                ){

                    const fileName =
                        command.replace(
                            "touch ",
                            ""
                        );


                    await this.fs.createFile(
                        user.uid,
                        fileName
                    );


                    output.innerHTML +=
                    `
                    file created<br><br>
                    `;

                    return;

                }


                // clear
                if(
                    command === "clear"
                ){

                    output.innerHTML =
                        "";

                    return;

                }


                output.innerHTML +=
                `
                unknown command<br><br>
                `;

            }

        );

    }

}