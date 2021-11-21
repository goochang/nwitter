import { dbService, storageService, authService} from "fbase";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import PImg from '../img/default_profile_normal.png';
import { firebaseDB } from "../fbase";

const Nweet = ({nweetObj, isOwner, userObj}) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);

    const getCreator = async () =>{
        const uid = userObj.uid;
        // const u = firebaseDB.ref('users/' + uid).once("value", snap => {
        //     console.log(snap.val());
        // })
        //const uu = firebaseDB.getInstance().getReference('users').orderByKey().equalTo(uid)
        const userRefrence = dbService.collection('users');
        const user = await userRefrence.doc(uid).get();
        console.log(authService.currentUser)


    }

    const onDeleteClick = async () =>{
        const ok = window.confirm("삭제 ㄱ?");

        getCreator();
        if(ok) {
            await dbService.doc(`nweets/${nweetObj.id}`).delete();

            if(nweetObj.attachmentUrl !== "") {
                await storageService.refFromURL(nweetObj.attachmentUrl).delete();
            }
        }
    }

    const onChange = (event) =>{
        const {target : {value}} = event;
        setNewNweet(value);
    }

    const onSubmit = async (event) => {
        event.preventDefault();

        await dbService.doc(`nweets/${nweetObj.id}`).update({text: newNweet});
        toggleEditing();
    }

    const toggleEditing = () => setEditing( (prev) => !prev);

    return (
        <div className="nweet">
            {editing ? (
                <>
                <form onSubmit={onSubmit} className="container nweetEdit">
                    <input value={newNweet} onChange={onChange} required
                    placeholder="Edit your nweet" autoFocus className="formInput" />
                    <input type="submit" value="update" className="formBtn" />
                </form>
                <button onClick={toggleEditing} className="formBtn cancelBtn">
                    Cancel
                </button>
                </>
            ) :
                <div>
                    <div className="profile_container">
                        <img src={PImg} width="50px" height="50px" alt="nweet" /> 
                        
                        { userObj && <div><span>{userObj.nickname}</span></div>}
                    </div>
                    <h4>{nweetObj.text}</h4>
                    {
                        nweetObj.attachmentUrl && (
                            <img src={nweetObj.attachmentUrl} width="50px" height="50px" alt="nweet" /> 
                        )
                    }
                    {
                        isOwner && (
                            <div className="nweet__actions">
                                <span onClick={onDeleteClick}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </span>
                                <span onClick={toggleEditing}>
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                </span>
                            </div>
                        )
                    }
                </div>
        }
        </div>
    )
}
export default Nweet; 