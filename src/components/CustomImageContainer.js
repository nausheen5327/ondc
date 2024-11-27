import React, { useEffect, useState } from "react";
import { CustomImageContainerStyled } from "@/styled-components/CustomStyles.style";
import placeholder from "../../public/static/notimage.png";

const CustomImageContainer = ({
                                  cursor,
                                  mdHeight,
                                  maxWidth,
                                  height,
                                  width,
                                  objectFit,
                                  minwidth,
                                  src,
                                  alt,
                                  borderRadius,
                                  marginBottom,
                                  smHeight,
                                  smMb,
                                  smMaxWidth,
                                  smWidth,
                                  test_image, aspectRatio,
                                  boxShadow
                              }) => {
    const [imageFile, setState] = useState(null);
    const [newObjectFit, setNewObjectFit] = useState(objectFit);
    useEffect(() => {
        if (src) {
            setState(src);
        } else {
            setState("https://ondcpreprod.nazarasdk.com/static/media/logo1.ae3b79430a977262a2e9.jpg");
            setNewObjectFit("contain");
        }
    }, [src]);
    const errorHeight = smHeight ? smHeight : "104px";
    // console.log("image", src);
    return (
        <CustomImageContainerStyled
            height={height}
            width={width}
            objectFit={newObjectFit}
            minwidth={minwidth}
            borderRadu={borderRadius}
            marginBottom={marginBottom}
            smHeight={smHeight}
            smMb={smMb}
            maxWidth={maxWidth}
            smMaxWidth={smMaxWidth}
            smWidth={smWidth}
            mdHeight={mdHeight}
            cursor={cursor}
            aspectRatio={aspectRatio}
            boxShadow={boxShadow}
        >
            <img
                src={imageFile}
                alt={alt}
                onError={(e) => {
                    // currentTarget.onerror = null; // prevents looping
                    // setState('https://ondcpreprod.nazarasdk.com/static/media/logo1.ae3b79430a977262a2e9.jpg');
                    e.target.style =
                        "objectFit:contain !important;width:auto !important;";
                    e.target.style.margin = "auto";
                }}
                loading="lazy"
            />
        </CustomImageContainerStyled>
    );
};
export default CustomImageContainer;
