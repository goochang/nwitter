import { dbService, storageService } from "fbase";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import PImg from '../img/default_profile_normal.png';

const NweetFactory = ({userObj}) => {

    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        if(nweet === "") {
            return;
        }
        const _nweet = nweet;
        const _attachment = attachment;
        setNweet("");
        setAttachment("");  

        let attachmentUrl = "";
        
        if(_attachment !== ""){
            const attachmentRef =  storageService
            .ref()
            .child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(_attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        console.log(userObj)
        await dbService.collection("nweets").add({
            text:_nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            creatorName: userObj.displayName,
            creatorEmail: userObj.email,
            attachmentUrl,
        });
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
        //console.log(theFile);
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const { currentTarget : {result }, } = finishedEvent;
            setAttachment(result);
        }

        if(theFile !== undefined)
            reader.readAsDataURL(theFile);
    }

    return (
        <form onSubmit={onSubmit} className="factoryForm base">
            <div className="factoryInput_profile base">
                <img src={userObj ? userObj.photoURL : PImg} alt="profile_image" /> 
            </div>
            <div className="factoryInput__container base">
                <div className="factoryInput_text">
                    <input 
                        className="factoryInput__input"
                        value={nweet}
                        onChange={onChange}
                        type="text"
                        placeholder="What's happening"
                        maxLength={120}
                    />
                </div>
                { attachment && 
                    (<div className="factoryForm__attachment base">
                        <img src={attachment} style={{backgroundImage: attachment,}} alt="attachment" />
                        <div className="factoryForm__clear" onClick={onClearAttachment}>
                            {/* <span>Remove</span> */}
                            <FontAwesomeIcon icon={faTimesCircle} />
                        </div>
                    </div>
                    )}
                <div className="factoryInput_button base">
                    <input type="submit" value="Tweet" className="factoryInput__arrow" aria-disabled={nweet === ""} />
                    
                    <input id="attach-file" type="file" accept="image/*"  onChange={onFileChange} style={{opacity:0}} />
                    <label htmlFor="attach-file" className="factoryInput__label">
                        <span>Add photos</span>
                        <FontAwesomeIcon icon={faPlus} />
                    </label>
                </div>
            </div>
            
        </form>
    )
};

export default NweetFactory; 