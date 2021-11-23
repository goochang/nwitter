import Nweet from "components/Nweet";
import ProfileEdit from "components/ProfileEdit";
import { authService, dbService } from "fbase";
import { useEffect, useState } from "react";
//import { useHistory } from "react-router";
import { withRouter, useHistory } from 'react-router-dom';


const Profile = ({userObj, refreshUser}) => {
    const [nweets, setNweets] = useState([]);
    const [name, setName] = useState("");

    const history = useHistory();
    
    const onLogoutClick = () => {
        authService.signOut();
        history.push("/");
    }

    const getMyNweets = async () => {
        if(userObj) {
            //const nweets = 
            await dbService.collection("nweets")
            .where("creatorId", "==", userObj.uid)
            .orderBy("createdAt", "asc")
            .onSnapshot((snapshot) =>{
                const newArray = snapshot.docs.map((document) => ({
                  id: document.id,
                  ...document.data(),
                }));
                setNweets(newArray);
            });

           // setNweets(nweets.docs.map((doc)=> doc.data()));
        }
    }

    const onChange = (event) => {
        const {target: {value}, } = event;
        setName(value);
    }

    const onSubmit = async (event) => {
        event.preventDefault();

        if(name !== "" && userObj.displayName !== name){
            await userObj.updateProfile({
                displayName: name
            });
            refreshUser();
        }
    }

    useEffect(()=> {
        if(!userObj){
            onLogoutClick()
        }
        getMyNweets();
    }, );

    return (
        <div>
            <ProfileEdit userObj={userObj} />
            <form onSubmit={onSubmit} className="profileForm">
                <input type="text" value={name} placeholder="what's your name?" 
                onChange={onChange} autoFocus className="formInput" />
                <input type="submit" value="이름변경" className="formBtn" 
                style={{marginTop: 10,}} />
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogoutClick}>
                Log Out
            </span>
            <div>
                {nweets.map((nweet) => (
                    <Nweet key={nweet.id} nweetObj={nweet} userObj={userObj}
                    isOwner={nweet.creatorId === userObj.uid} />
                )
                )}
            </div>
        </div>
    )
}

export default withRouter(Profile);