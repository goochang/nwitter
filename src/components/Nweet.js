import { dbService, storageService } from "fbase";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({nweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);

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