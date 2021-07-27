import { DropzoneArea } from 'material-ui-dropzone';
import React, { useState } from 'react'
import {postApi} from '../../apis/Api'
import Button from '@material-ui/core/Button'
import Warning from '../component/Warning';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function Upload ({match}) {
    const [files, setFiles] = useState([])
    const [load, setLoad] = useState(false)
    const   titleStyle = {
        marginBottom:'30px',
        textAlign:'left',
        padding:'30px',
        fontSize:'20px'
    },      uploadForm = {
        border:'1px solid grey',
        width:'600px',
        margin:'30px auto'
    },      buttonBoxStyle = {
        textAlign:'center',
        margin:'30px auto'
    }
    const   uniqueNumber = match.params.id * 1,
            serialKey = 101562347

    const onUpload = async () => {
        if(files.length === 0) return
        setLoad(true)
        const { treatmentId } = await postApi('/treatment/init', {
            uniqueNumber,
            serialKey,
            fileNameList : files.map(file => file['name'])
        })

        if(treatmentId) await postApi('/treatment/add', {
            patientUniqueId : uniqueNumber,
            serialKey,
            treatmentId,
            files
        }, true)
        setLoad(false)
    }

    return (
        <div>
            <Warning
            open={load}
            onClose={()=>{}}
            submit={false}
            >데이터 적용중입니다.</Warning>
            {load ? <div style={{width:'300px', margin:'30px auto'}}><CircularProgress size={200}/></div> :
            <div>
                <div style={titleStyle}>영상업로드</div>
                <div style={uploadForm}>
                <DropzoneArea
                    onChange={files => setFiles(files)}
                    maxFileSize={9000000}
                    filesLimit={4}
                />
                </div>
                <div style={buttonBoxStyle}>
                <Button variant="contained" color="primary" onClick={onUpload}>
                Upload
                </Button>
                </div>
            </div>}
        </div>
    )
}