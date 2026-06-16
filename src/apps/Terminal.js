export default class Terminal {

    constructor(fs,wm,auth){

        this.fs = fs;
        this.wm = wm;
        this.auth = auth;
        this.currentFolder = "root";

    }

    open(){

        const termWin =
            this.wm.createWindow(
                "Terminal",

`
<div id="terminal-output"
style="
background:black;
color:lime;
height:300px;
overflow:auto;
padding:10px;
font-family:monospace;
">

WebOS Terminal v2<br><br>

</div>

<input id="terminal-input"
style="width:100%;"
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

                if(e.key!=="Enter") return;

                const command =
                    input.value.trim();

                input.value="";

                output.innerHTML +=
                    `> ${command}<br>`;

                const user =
                    this.auth.currentUser;

                if(command==="help"){

                    output.innerHTML +=
`
help
ls
pwd
cd
mkdir
touch
rm
cat
echo
whoami
date
clear<br><br>
`;
                    return;
                }

                if(command==="whoami"){

                    output.innerHTML +=
                        `${user.uid}<br><br>`;

                    return;
                }

                if(command==="date"){

                    output.innerHTML +=
                        `${new Date()}<br><br>`;

                    return;
                }

                if(command.startsWith("echo ")){

                    output.innerHTML +=
                        command.replace("echo ","")
                        + "<br><br>";

                    return;
                }

                if(command==="pwd"){

                    output.innerHTML +=
                        this.currentFolder
                        + "<br><br>";

                    return;
                }

                if(command==="ls"){

                    const files =
                        await this.fs.getNodes(
                            user.uid,
                            this.currentFolder
                        );

                    files.forEach(file=>{

                        output.innerHTML +=

                        file.type==="folder"

                        ?

                        `📁 ${file.name}<br>`

                        :

                        `📄 ${file.name}<br>`;

                    });

                    output.innerHTML+="<br>";
                    return;
                }

                if(command.startsWith("mkdir ")){

                    const name =
                        command.replace(
                            "mkdir ",
                            ""
                        );

                    await this.fs.createFolder(
                        user.uid,
                        name,
                        this.currentFolder
                    );

                    output.innerHTML +=
                        "folder created<br><br>";

                    return;
                }

                if(command.startsWith("touch ")){

                    const name =
                        command.replace(
                            "touch ",
                            ""
                        );

                    await this.fs.createFile(
                        user.uid,
                        name,
                        this.currentFolder
                    );

                    output.innerHTML +=
                        "file created<br><br>";

                    return;
                }

                if(command.startsWith("rm ")){

                    const name =
                        command.replace(
                            "rm ",
                            ""
                        );

                    const files =
                        await this.fs.getNodes(
                            user.uid,
                            this.currentFolder
                        );

                    const target =
                        files.find(
                            file =>
                            file.name===name
                        );

                    if(!target){

                        output.innerHTML +=
                            "not found<br><br>";

                        return;
                    }

                    await this.fs.deleteRecursive(
                        user.uid,
                        target.id
                    );

                    output.innerHTML +=
                        "deleted<br><br>";

                    return;
                }

                if(command.startsWith("cat ")){

                    const name =
                        command.replace(
                            "cat ",
                            ""
                        );

                    const file =
                        await this.fs.getFile(
                            user.uid,
                            name
                        );

                    if(!file){

                        output.innerHTML +=
                            "file not found<br><br>";

                        return;
                    }

                    output.innerHTML +=
                        `${file.content}<br><br>`;

                    return;
                }

                if(command==="clear"){

                    output.innerHTML = "";
                    return;
                }

                output.innerHTML +=
                    "unknown command<br><br>";

            }
        );
    }
}