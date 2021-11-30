import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useHistory } from "react-router";


const Side = (userObj) => {
    const [sValue, setSValue] = useState("")
    const [isFocus, setIsFocus] = useState(false)

    const history = useHistory();

    const onChange = (event) => {
        const { target: {value} } = event;
        setSValue(value)
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
                            placeholder="Search Nwitter" autoComplete="false" id="sInput"
                            onFocus={()=> {setIsFocus(true)}} onBlur={()=> {setIsFocus(false)}} />
                        </form>
                    </div>
                </label>
            </div>
        </div>
    )
}

export default Side;