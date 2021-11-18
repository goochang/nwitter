import { dbService, storageService } from "fbase";
import { useState } from "react";

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
        <div>
            {editing ? (
                <>
                <form onSubmit={onSubmit}>
                    <input value={newNweet} onChange={onChange} required />
                    <input type="submit" value="update" />
                </form>
                <button onClick={toggleEditing}>cancel</button>
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
                        <>
                        <button onClick={onDeleteClick}>Delete</button>
                        <button onClick={toggleEditing}>Edit</button>
                        </>
                    )
                }
                </div>
        }
        </div>
    )
}
export default Nweet;