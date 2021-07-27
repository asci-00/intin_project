async function Api(target, parm) {
    let url = 'http://222.114.14.190:8080' + target + '?'
    if(parm) Object.keys(parm).forEach(key => { url += `${key}=${parm[key]}&` })
    url.substr(0, url.length - 1)
    return (await fetch(url).then(res => res.json()))
}

export async function postApi(target, parm, flag = false) {
    let url = `http://222.114.14.190:8080${target}`
    if(flag) {
        const data = new FormData()
        data.append('patientUniqueId', parm.patientUniqueId)
        data.append('serialKey', parm.serialKey)
        data.append('treatmentId', parm.treatmentId)

        for(const file of parm.files) {
            data.delete('files')
            data.append('files', file)

            const res = await fetch(url, {
                method : 'POST',
                body : data
            })
        }
        return 'success'
    }
    else {
        var formBody = [];
        for (var property in parm) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(parm[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        return await fetch(url, {
            method : 'POST',
            body : formBody,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
        }).then(res => res.json())
    }
}

export default Api