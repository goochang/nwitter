import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import IntroduceModal from "./IntroduceModal";
import "./register.css";
import RegisterModal from "./RegisterModal";
import ReactCrop from "react-image-crop";
import PImgModal from "./PImgModal";

const PImgEditModal = ({setModalContent, onRequestClose, email, name, nickname, password, _pImg}) => {
    const [fileUrl, setFileUrl] = useState("");
    const [crop, setCrop] = useState({
        unit: "px",
        width: 500,
        height: 450,
        aspect: 16 / 9
    });
    const [completedCrop, setCompletedCrop] = useState(null);

    const imageRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [croppedImageUrl, setCroppedImageUrl] = useState("");

    const isValidation = () => {
        console.log(fileUrl)
        if(fileUrl !== undefined) {
            return true;
        } else {
            return false;
        }
    }
    const onImageLoaded = (image) => {
        imageRef.current = image;
    };
    const onChange = (_crop) => {
        setCrop(_crop);
        console.log(_crop)
        const h = imageRef.current.clientHeight;
        const w = imageRef.current.clientWidth;

        if(imageRef.current !== null) {
            let y_val;
            if(w > h){
                y_val =  "-15px";
            } else {
                y_val = (_crop.y - 15) + "px";
            }
            
            imageRef.current.style.bottom = y_val;
        }  
    }
    const onCropComplete = (crop) => {
        setCompletedCrop(crop)
        makeClineCrop(crop);        
    }
    const makeClineCrop = async (crop)  =>{
        if (imageRef && crop.width && crop.height) {
            const croppedImageUrl = await getCroppedImg();
            setCroppedImageUrl(croppedImageUrl);
        }
    }
    const getCroppedImg = () =>{
        if (!completedCrop || !previewCanvasRef.current || !imageRef.current) {
            return;
        }

        const image = imageRef.current;
        const canvas = previewCanvasRef.current;
    
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');
        const pixelRatio = window.devicePixelRatio;
    
        canvas.width = 500;
        canvas.height = 450;
        canvas.style.width = "500px";
        canvas.style.height = "450px";
    
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';
    
        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            500,
            450
        ); 

        console.log("cap")
        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        console.error('Canvas is empty');
                        return;
                    }
                    blob.name = "newFile.jpeg";
                    window.URL.revokeObjectURL(fileUrl);
                    setFileUrl(window.URL.createObjectURL(blob));
                    resolve(fileUrl);
                },
                'image/jpeg',
                1
            );
        });
    }
    const goPrev = () => {
        setModalContent(
            <PImgModal
            setModalContent={setModalContent}
            name={name}
            nickname={nickname}
            email={email}
            password={password}
            pImg={_pImg}
            />
        );
    }
    const goNext = () => {
        if(isValidation()){
            console.log(fileUrl)
            setModalContent(
                <IntroduceModal 
                setModalContent={setModalContent}
                name={name}
                nickname={nickname}
                email={email}
                password={password}
                pImg={fileUrl}
                />
            )
        } else {
            console.log("nono")
        }
    }
    return (
        <div className="register_modal pImgEditModal rBase">
            <div className="profile_edit_nav rBase">
                <button className="iconBtn" id="cancel" onClick={goPrev} >
                    <FontAwesomeIcon icon={faArrowLeft} color={"rgb(217, 217, 217)"} size="1x" />
                </button>
                <span>미디어 편집</span>
                <div className={`rBase next_container${isValidation() ? " active" : ""} `}>
                    <button className="nextBtn" onClick={() => {goNext()} }>적용하기</button>
                </div>
            </div>

            <div className="img_preview rBase rCenter ">
                {_pImg && (
                <ReactCrop
                    src={_pImg}
                    crop={crop}
                    ruleOfThirds
                    onImageLoaded={(i) => onImageLoaded(i)}
                    onChange={(c, pc) => onChange(c, pc)}
                    onCropChange
                    onComplete={(c, pc) => onCropComplete(c, pc)}
                    locked={true}
                />
                )}
                {_pImg && (
                    <div>
                    <canvas
                      ref={previewCanvasRef}
                      style={{
                        width: Math.round(completedCrop?.width ?? 0),
                        height: Math.round(completedCrop?.height ?? 0)
                      }}
                    />
                  </div>
                )}
            </div>
        </div>
    )
}
export default PImgEditModal;