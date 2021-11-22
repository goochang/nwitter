import { dbService, storageService, authService} from "fbase";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import PImg from '../img/default_profile_normal.png';

const Nweet = ({nweetObj, isOwner, userObj}) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    const [creator, setCreator] = useState(null)

    useEffect( () => {
        getUser();
        console.log("getu")
    }, [])
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

    const getUser = async () => {
        const users = await dbService.collection("users").where("email", "==", nweetObj.creatorEmail).get();
        users.forEach((user) => {
            console.log(user.data())
            setCreator(user.data())
        })
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
                        <img src={creator !== null ? creator.photoURL : PImg} width="50px" height="50px" alt="nweet" /> 
                        
                        { userObj && <div><span>{userObj.displayName}</span></div>}
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