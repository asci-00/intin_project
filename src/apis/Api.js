async function Api(target, parm) {
    let url = 'http://222.114.14.190:8080' + target + '?'
    if(parm) Object.keys(parm).forEach(key => { url += `${key}=${parm[key]}&` })
    url.substr(0, url.length - 1)
    return (await fetch(url).then(res => res.json()))
}
export default Api