export function switchPermission (e, id, arr, serArr, oppositeArr, setOppositeArr ) {
    let tempArr = []
    let permission
    console.log(id)
    arr.forEach(i => {
        if(i.id !== id){
            tempArr.push(i)
        }else{
            permission = i
        }
    })
    serArr(tempArr)

    tempArr = oppositeArr
    tempArr.push(permission)
    setOppositeArr(tempArr)
}