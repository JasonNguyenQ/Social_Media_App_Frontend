import { FileBlob } from "../constants/types"

export function FileBlobToURL(blob: FileBlob | undefined, defaultURL: string | undefined = undefined){
    if(!blob) return defaultURL
    
    let url = "data:image/png;base64,";
    for(const code of blob.data){
        url += String.fromCharCode(code)
    }
    return url
}