import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authService, firebaseDB } from "fbase";
import { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

const Side = () => {
    const [sValue, setSValue] = useState("")
    const [isFocus, setIsFocus] = useState(false)
    const [nweets, setNweets] = useState([]);

    const history = useHistory();

    const onChange = (event) => {
        console.log("onchange")
        const { target: {value} } = event;
        setSValue(value)
        
        if(value !== "" && sValue !== value){
            const ref = firebaseDB.ref('posts');
            ref
            .orderByChild('text')
            .startAt(sValue)
            .endAt(sValue+"\uf8ff")
            .once('value')
            .then(c => {
                console.log(c.val()) 
                setNweets(c.val());
            });      

        }
    }

    const onSubmit = (event) => {
        event.preventDefault();

        history.push('/search/' + sValue );
    }
    return (
        <div className="side base">
            <div className={`base ${isFocus ? "focus search_container" : "search_container"}`}>
                <label htmlFor="sInput" className="search_label base">
                    <div>
                        <FontAwesomeIcon icon={faSearch} color={"rgb(217, 217, 217)"} size="1x" />
                    </div>
                    <div>
                        <form onSubmit={onSubmit}>
                            <input type="text" value={sValue} onChange={onChange} className="searchInput" 
                            placeholder="Search Nwitter" autoComplete="off" id="sInput"
                            onFocus={()=> {setIsFocus(true)}} onBlur={()=> {setIsFocus(false)}} />
                        </form>
                    </div>
                </label>
            </div>
            <div className={`base ${isFocus ? "focus searchResult" : "searchResult"}`}>
                <nav>
                    <Link to="/search/collet">
                        <div className="base resultWrap">
                            <img src="https://avatars.githubusercontent.com/u/15142890?v=4" alt="" />
                            <div className="base">
                                <span className="displayName">
                                    코렛트
                                </span>
                                <span className="userID">
                                    @collet0802
                                </span>
                                <span className="user_addi">
                                    코언팔이
                                </span>
                            </div>
                        </div>
                    </Link>
                    { isFocus &&
                        Object.keys(nweets).map((nweet) => {
                            const obj = nweets[nweet];
                            console.log(obj)
                            return(   
                                <Link to="/search/collet">
                                    <div className="base resultWrap">
                                        <img src="https://avatars.githubusercontent.com/u/15142890?v=4" alt="" />
                                        <div className="base">
                                            <span className="displayName">
                                                {obj.creatorName}
                                            </span>
                                            <span className="userID">
                                                {obj.creatorEmail}
                                            </span>
                                            <span className="user_addi">
                                                {obj.text}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );  
                        })
                    }
                </nav>
            </div>

            { authService.currentUser === null && (
                <div>
                    <span>트위터에 처음이세요?</span>
                </div>
            )}
            
        </div>
    )
}

export default Side;