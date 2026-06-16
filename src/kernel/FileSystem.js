import {
    collection,
    getDocs,
    getDoc,
    doc,
    setDoc,
    deleteDoc
}
from "firebase/firestore";

import { db } from "../firebase/firebase.js";

export default class FileSystem {

    async initialize(uid){

        const ref =
            collection(
                db,
                "users",
                uid,
                "filesystem"
            );

        const snapshot =
            await getDocs(ref);

        if(!snapshot.empty) return;

        const defaults = [
            "Documents",
            "Downloads",
            "Pictures",
            "Desktop"
        ];

        for(const folder of defaults){

            await setDoc(
                doc(
                    db,
                    "users",
                    uid,
                    "filesystem",
                    folder
                ),
                {
                    name:folder,
                    type:"folder",
                    parent:"root"
                }
            );
        }
    }

    async getNodes(uid,parent="root"){

        const ref =
            collection(
                db,
                "users",
                uid,
                "filesystem"
            );

        const snapshot =
            await getDocs(ref);

        return snapshot.docs
            .map(doc=>({
                id:doc.id,
                ...doc.data()
            }))
            .filter(
                node=>node.parent===parent
            );
    }

    async createFolder(uid,name,parent="root"){

        await setDoc(
            doc(
                db,
                "users",
                uid,
                "filesystem",
                name
            ),
            {
                name,
                type:"folder",
                parent
            }
        );
    }

    async createFile(uid,name,parent="root"){

        await setDoc(
            doc(
                db,
                "users",
                uid,
                "filesystem",
                name
            ),
            {
                name,
                type:"file",
                parent,
                content:""
            }
        );
    }

    async getFile(uid,name){

        const ref =
            doc(
                db,
                "users",
                uid,
                "filesystem",
                name
            );

        const snapshot =
            await getDoc(ref);

        return snapshot.data();
    }

    async saveFile(uid,name,content){

        const old =
            await this.getFile(
                uid,
                name
            );

        await setDoc(
            doc(
                db,
                "users",
                uid,
                "filesystem",
                name
            ),
            {
                ...old,
                content
            }
        );
    }

    async deleteNode(uid,nodeId){

        await deleteDoc(
            doc(
                db,
                "users",
                uid,
                "filesystem",
                nodeId
            )
        );
    }

    async deleteRecursive(uid,nodeId){

        const children =
            await this.getNodes(
                uid,
                nodeId
            );

        for(const child of children){

            await this.deleteRecursive(
                uid,
                child.id
            );
        }

        await this.deleteNode(
            uid,
            nodeId
        );
    }

}