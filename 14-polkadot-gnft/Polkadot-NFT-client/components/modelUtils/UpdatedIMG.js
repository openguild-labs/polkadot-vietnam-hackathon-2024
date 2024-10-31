import React, { useState, useRef, useEffect } from "react";

function UpdatedIMG({ name }) {

   return (
      <>
         {name == "Background" ? (
                  <img
                     src={"../../images/bannerIMG/background.gif"}
                     alt=""
                     className="w-full h-[90%] bg-no-repeat bg-center object-cover"
                  />
               ) : (
                  <div className="w-[20%] max-lg:w-[30%] max-md:w-[40%] max-sm:w-[50%] h-full rounded-lg border-[5px] border-[#2FAEAC]">
                     <img
                        src={"../../images/logo1.png"}
                        alt=""
                        className={`${name == "Background" ? "w-full h-full bg-no-repeat bg-center object-cover" : "object-cover h-full w-full rounded-sm"}`}
                     />
                  </div>
               )}
      </>
   );
}

export default UpdatedIMG;
