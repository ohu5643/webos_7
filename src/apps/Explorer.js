export default class Explorer {

    constructor(fs, wm, auth) {

        this.fs = fs;
        this.wm = wm;
        this.auth = auth;

        this.currentFolder = "root";

    }

    async open() {

        const user =
            this.auth.currentUser;

        if (!user) return;

        const nodes =
            await this.fs.getNodes(
                user.uid,
                this.currentFolder
            );

        const html =
            nodes.map(
                node => `

                <div
                    class="file-item"
                    data-id="${node.id}"
                    data-type="${node.type}"
                >

                    ${
                        node.type === "folder"
                        ? "📁"
                        : "📄"
                    }

                    ${node.name}

                </div>

                `
            ).join("");

        const win =
            this.wm.createWindow(
                "Explorer",

                `

<div>

현재 위치 :
${this.currentFolder}

</div>

<button id="back-folder">
← 뒤로
</button>

<br><br>
                <button id="new-folder">

                    새 폴더

                </button>

                <button id="new-file">

                    새 파일

                </button>

                <hr>

                <div id="folder-list">

                    ${html}

                </div>
                `
            );

        win
            .querySelector(
                "#new-folder"
            )
            .addEventListener(
                "click",

                async () => {

                    const folderName =
                        prompt(
                            "폴더 이름"
                        );

                    if (!folderName) return;

                    await this.fs.createFolder(
                        user.uid,
                        folderName,
                        this.currentFolder
                    );

                    win.remove();

                    this.open();

                }
            );

        win
            .querySelector(
                "#new-file"
            )
            .addEventListener(
                "click",

                async () => {

                    const fileName =
                        prompt(
                            "파일 이름"
                        );

                    if (!fileName) return;

                    await this.fs.createFile(
                        user.uid,
                        fileName,
                        this.currentFolder
                    );

                    win.remove();

                    this.open();

                }
            );

        win
            .querySelector(
                "#back-folder"
            )
            .addEventListener(
                "click",
                () => {

                    this.currentFolder =
                        "root";

                    win.remove();

                    this.open();

                }
            );

        win
            .querySelectorAll(
                ".file-item"
            )
            .forEach(
                item => {

                    item.addEventListener(
                        "dblclick",
                        async () => {

                            const type =
                                item.dataset.type;

                            const name =
                                item.textContent
                                .replace("📁", "")
                                .replace("📄", "")
                                .trim();

                            if (
                                type === "folder"
                            ) {

                                this.currentFolder =
                                    name;

                                win.remove();

                                this.open();

                                return;

                            }

                            if (
                                type === "file"
                            ) {

                                const file =
                                    await this.fs.getFile(
                                        user.uid,
                                        name
                                    );

                                const noteWin =
                                    this.wm.createWindow(
                                        name,
                                        `
            <textarea
                id="editor"
                style="
                    width:100%;
                    height:300px;
                "
            >${file.content || ""}</textarea>

            <br><br>

            <button id="save-file">
                저장
            </button>
            `
                                    );

                                noteWin
                                    .querySelector(
                                        "#save-file"
                                    )
                                    .addEventListener(
                                        "click",
                                        async () => {

                                            const content =
                                                noteWin
                                                .querySelector(
                                                    "#editor"
                                                )
                                                .value;

                                            await this.fs.saveFile(
                                                user.uid,
                                                name,
                                                content
                                            );

                                            alert(
                                                "저장 완료"
                                            );

                                        }
                                    );

                            }

                        }
                    );

                }
            );

    }

}