import { useEffect } from "react";

export default function useOnClickOutside(ref,handler){
    useEffect(()=>{
        const listener = (e) => {
            if(!ref.current || ref.current.contains(e.target)){
                return;
            }
            handler(e)
        }
        document.addEventListener("mousedown",listener)
        document.addEventListener("touchdown",listener)

        return ()=>{
            document.removeEventListener("mousedown",listener)
            document.removeEventListener("touchdown",listener)
        }
    },[ref,handler])
}