import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CoverImgModal from "./CoverImgModal";
import ProfileImgModal from "./ProfileImgModal";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import React, { useEffect, useRef, useState } from "react";

function generateDownload(canvas, crop) {
    if (!crop || !canvas) {
        return;
    }
  
    canvas.toBlob(
        (blob) => {
            const previewUrl = window.URL.createObjectURL(blob);
    
            const anchor = document.createElement('a');
            anchor.download = 'cropPreview.png';
            anchor.href = URL.createObjectURL(blob);
            anchor.click();
    
            window.URL.revokeObjectURL(previewUrl);
        },
        'image/png',
        1
    );
}

const ProfileImgEditModal = ({setModalContent, userObj, setModalNum, profileImg, coverImg}) => {

    const [crop, setCrop] = useState({unit: "%", aspect: 16 / 9, width:100});
    const [completedCrop, setCompletedCrop] = useState(null);

    const imageRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [croppedImageUrl, setCroppedImageUrl] = useState("");
    const [fileUrl, setFileUrl] = useState("");

    const [imgForm, setImgForm] = useState(0);

    const onImageLoaded = (image) => {
        imageRef.current = image;
        if(imageRef.current !== null) {
            const h = imageRef.current.clientHeight;
            const w = imageRef.current.clientWidth;
            
            if(w < h){
                setCrop({unit: "%", aspect: 16 / 9, width:100});
            } else {
                setCrop({unit: "%", aspect: 9 / 16, height:100});
                imageRef.current.style.left = 0;
            }
        }
    };

    const onChange = (crop) => {
        setCrop(crop);
        console.log(crop)
        if(imageRef.current !== null) {
            const h = imageRef.current.clientHeight;
            const w = imageRef.current.clientWidth;
            
            if(w < h){
                setImgForm(1)
                if(crop.y > h-450) crop.y = h-450;
                const y_val = (crop.y - 25) + "px";
                imageRef.current.style.bottom = y_val;
            } else if(w > h){ //옆으로 긴거
                setImgForm(2)
                let x_val = (crop.x - 365)
                if(x_val > 0) x_val = 0
                if(x_val < h-w-25) x_val = h-w-25
                imageRef.current.style.left = x_val + "px";;
            }
        }  
    }

    useEffect(() => {
        if (!completedCrop || !previewCanvasRef.current || !imageRef.current) {
            return;
        }
        
        const image = imageRef.current;
        const canvas = previewCanvasRef.current;
        const crop = completedCrop;
    
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');
        const pixelRatio = window.devicePixelRatio;
    
        canvas.width = crop.width * pixelRatio * scaleX;
        canvas.height = crop.height * pixelRatio * scaleY;
    
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
            crop.width * scaleX,
            crop.height * scaleY
        );           
    },[completedCrop]);

    return (
        <div className="profile_modal base profile_edit_modal">
            <div className="profile_edit_nav base">
                <button className="cancelBtn" onClick={() => {
                    setModalNum(1);
                    setModalContent(
                        <ProfileImgModal 
                            setModalContent={setModalContent} 
                            userObj={userObj}
                            setModalNum={setModalNum}
                            profileImg={profileImg}
                            coverImg={coverImg}
                    />);
                }} >
                    <FontAwesomeIcon icon={faArrowLeft} color={"rgb(217, 217, 217)"} size="1x" />
                </button>
                <span>미디어 편집</span>
                <div>
                    <button className="okBtn" onClick={() => {
                        setModalNum(3);
                        setModalContent(
                            <CoverImgModal 
                            setModalContent={setModalContent} 
                            userObj={userObj}
                            setModalNum={setModalNum}
                            profileImg={profileImg}
                            coverImg={coverImg}
                        />);
                    }} >적용하기</button>
                </div>
            </div>

            <div className="img_preview base center ">
                {profileImg && (
                
                <ReactCrop
                    src={profileImg}
                    crop={crop}
                    ruleOfThirds
                    onImageLoaded={onImageLoaded}
                    onChange={onChange}
                    onComplete={(c) => setCompletedCrop(c)}
                    locked={true}
                    className={imgForm === 1 ? "rCrop_wBig" : (imgForm === 2 ? "rCrop_hBig" : "rCrop_square")}
                    // children={<div style={{backgroundImage:`url(${profileImg})`}} >qq</div>}
                />
                )}
                {profileImg && (
                    <div>
                    <canvas
                      ref={previewCanvasRef}
                      // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                      style={{
                        width: Math.round(completedCrop?.width ?? 0),
                        height: Math.round(completedCrop?.height ?? 0)
                      }}
                    />
                  </div>
                )}
                {croppedImageUrl && (
                <img alt="Crop" style={{ maxWidth: "100%" }} src={croppedImageUrl} />
                )}
            </div>

            
        </div>
    )
}
export default ProfileImgEditModal;