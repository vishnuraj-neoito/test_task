
function validateVersion(version:string) {
    if(version ==='/v1'){
        return '1.0.0'
    }else{
        return 'null'
    }
}
export default validateVersion;