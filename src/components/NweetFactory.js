import { dbService, storageService } from "fbase";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const NweetFactory = ({userObj}) => {
    
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();

        let attachmentUrl = "";
        if(attachment !== ""){
            const attachmentRef =  storageService
            .ref()
            .child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        
        await dbService.collection("nweets").add({
            text:nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        });
        setNweet("");
        setAttachment("");  

    }

    const onChange = (event) => {
    event.preventDefault();
    const { target : {value },} = event;
    setNweet(value);
    }

    const onClearAttachment = () => {setAttachment("")}
    
    const onFileChange = (event) => {
    const { target: {files}, } = event;
    const theFile = files[0];
    console.log(theFile);
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
        const { currentTarget : {result }, } = finishedEvent;
        setAttachment(result);
    }
    reader.readAsDataURL(theFile);
    }

    return (
        <form onSubmit={onSubmit}>
            <input 
            value={nweet}
            onChange={onChange}
            type="text"
            placeholder="what's on your mind"
            maxLength={120}
            />
            <input type="file" accept="image/*"  onChange={onFileChange}  />
            <input type="submit" value="nweet" />
            { attachment && 
            <div>
                <img alt="qwe" src={attachment} width="50px" height="50px" />
                <button onClick={onClearAttachment}>Clear</button>
            </div>
            }
        </form>
    )
};

export default NweetFactory;