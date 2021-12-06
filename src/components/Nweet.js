import { dbService, firebaseDB, storageService} from "fbase";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import PImg from '../img/default_profile_normal.png';

const Nweet = ({nweetObj, isOwner, userObj}) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    const [creator, setCreator] = useState(null)

    
    const onDeleteClick = async () =>{
        const ok = window.confirm("삭제 ㄱ?");

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

    useEffect( () => {
        firebaseDB.ref('users')
        .orderByChild('uid')
        .startAt(nweetObj.creatorId)
        .endAt(nweetObj.creatorId+"\uf8ff")
        .once('value', snapshot => {
            const user = snapshot.val();
            setCreator(user[Object.keys(user)[0]] );
        });
    }, [nweetObj])

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
            
                <div className="nweet_container base">
                    <div className="nweet_profile base">
                        <img src={creator !== null ? (creator.photoURL !== "" ? creator.photoURL : PImg)  : ""} 
                        alt="profile_image" /> 
                    </div>
                    <div className="nweet_content base">
                        { creator && 
                        <div className="nweet_profile_name_container">
                            <span className="profile_displayName">{creator.displayName}</span>
                        </div>}
                        
                        <div className="nweet_content_box base">
                            <span>{nweetObj.text}</span>
                            {
                                nweetObj.attachmentUrl && (
                                    <img src={nweetObj.attachmentUrl} alt="nweet_attachment" /> 
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
                    </div>
                </div>
        }
        </div>
    )
}
export default Nweet; 