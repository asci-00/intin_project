import React, { Component, useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import Api from '../../apis/Api'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Chart from "react-google-charts";

const useStyles = makeStyles((theme) => ({
    navBox: {
        display: 'grid',
        width: '80%', margin: 'auto'
    },
    navItem: {
        width: '200px',
        borderRadius: '10px',
        background: 'powderblue', color: 'black',
        textAlign: 'center',
        margin: '5px auto',
        padding: '10px'
    }, active: {
        background: '#e39999'
    },
    section: {
        display: 'grid',
        gridTemplateRows: '1fr 1fr 1fr',
        width: '80%', margin: '30px auto 0 auto',
        gridGap: '30px'
    },
    topSection: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridGap : '10px',
        '& video': {
            width: '80%',
            border: '2px solid grey',
            background: 'grey',
        }, paddingBottom: '20px',
        borderBottom: '1px solid grey',
    }, bottomSection: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        borderBottom: '1px solid grey',
    }, table: {},
    totalBox : {
        display:'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        '& video' : { width:'100%' }
    }
}))
export default function Treatment({ match, history }) {
    const [treatments, setTreatment] = useState([])
    const [selected, setSelected] = useState(0)
    const [total, setTotal] = useState(0)
    const classes = useStyles()


    useEffect(() => {
        let sum = 0
        if (match.params.id) Api('/treatment/info', { treatmentId: match.params.id }).then(res => {
            if (res.status !== 200) {
                
            } else {
                let stop = 0, small = 0, large = 0, motility = 0, linearity = 0, count = 0
                res['analyzes'].forEach(data => {
                    stop += data['stop']
                    small += data['small']
                    large += data['large']
                    motility += data['motility']
                    linearity += data['linearity']
                    count += data['count']
                })
                const len = res['analyzes'].length
                const temp = {
                    stop : Number((stop/len).toFixed(2)), 
                    small : Number((small/len).toFixed(2)), 
                    large : Number((large/len).toFixed(2)),
                    motility : Number((motility/len).toFixed(2)),
                    linearity : Number((linearity/len).toFixed(2)),
                    count : (count/len).toFixed(2) * 1111000,
                }
                setTreatment({...res, analyzes : [{...temp}].concat(res['analyzes'])})
            }
        })
        else history.push('/dashboard')
    }, [])

    if (match.params.id === undefined) {
        return <div></div>
        history.push('/dashboard')
    }

    if (treatments.length < 1) return <div></div>
    else {
        const { file, stop, small, large, motility, linearity, count, deviceKey, ...info } = treatments['analyzes'][selected]
        const { patientName } = treatments
        const chartData = [
            { country: 'stop', area: stop },
            { country: 'small', area: small },
            { country: 'large', area: large },
        ]
        return (
            <div>
                <div className={classes.navBox} style={{
                    gridTemplateColumns : `repeat(${treatments['analyzes'].length}, 1fr)`
                }}>
                    {treatments['analyzes'].map((data, idx) =>
                        <div
                            className={`${classes.navItem} ${idx === selected ? classes.active : ''}`}
                            key={idx}
                            onClick={() => { setSelected(idx) }}
                        >{idx === 0 ? '종합결과' : `검사결과(${idx})`}</div>)}
                </div>
                <div className={classes.section}>
                    <div className={classes.topSection}>
                        {selected === 0 ? <div className={classes.totalBox}>
                            {treatments['analyzes'].map((data, idx) => {
                                if(idx === 0) return undefined
                                return <video controls src={
                                    `http://222.114.14.190:8080/treatment/stream/${treatments['analyzes'][idx]['file']['fileName']}`
                                } key={idx}></video>
                            })}
                        </div> : <div><video controls src={
                            `http://222.114.14.190:8080/treatment/stream/${treatments['analyzes'][selected]['file']['fileName']}`
                        }></video></div>}
                        
                        <div>
                            <TableContainer style={{ border: '1px solid grey' }}>
                                <Table className={classes.table} aria-label="simple table">
                                    <TableHead style={{background : '#888'}}>
                                        <TableRow>
                                            <TableCell>측정항목</TableCell>
                                            <TableCell>측정값</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selected === 0 ? 
                                            <TableRow>
                                                <TableCell component="th" scope="row">
                                                    정자개수
                                                </TableCell>
                                                <TableCell>{treatments['analyzes'][0]['count']}</TableCell>
                                            </TableRow>
                                        : Object.keys(info).map((key, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell component="th" scope="row">
                                                    {key}
                                                </TableCell>
                                                <TableCell>{info[key]}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                    <div className={classes.bottomSection}>
                        <div>
                            <TableContainer style={{ border: '1px solid grey', width: '80%' }}>
                                <Table className={classes.table} aria-label="simple table">
                                    <TableHead style={{background : '#888'}}>
                                        <TableRow>
                                            <TableCell>등급</TableCell>
                                            <TableCell>개수</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                small
                                            </TableCell>
                                            <TableCell>{(small * 1111000).toFixed(0)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                stop
                                            </TableCell>
                                            <TableCell>{(stop * 1111000).toFixed(0)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                large
                                            </TableCell>
                                            <TableCell>{(large * 1111000).toFixed(0)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        <div style={{ width: '80%', margin: '0 auto', padding: '30px' }}>
                            <Chart
                                width={'500px'}
                                height={'300px'}
                                chartType="PieChart"
                                loader={<div>Loading Chart</div>}
                                data={[
                                    ['name', 'value'],
                                    ['small', small],
                                    ['stop', stop],
                                    ['large', large],
                                ]}
                                rootProps={{ 'data-testid': '1' }}
                            />
                        </div>
                    </div>
                    <div className={classes.bottomSection}>
                        <div>
                            <TableContainer style={{ border: '1px solid grey', width: '80%' }}>
                                <Table className={classes.table} aria-label="simple table">
                                    <TableHead style={{background : '#888'}}>
                                        <TableRow>
                                            <TableCell>속성</TableCell>
                                            <TableCell>값</TableCell>
                                            <TableCell>WHO기준</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                활동성
                                            </TableCell>
                                            <TableCell>{(motility * 100).toFixed(2)}%</TableCell>
                                            <TableCell>{(motility * 100).toFixed(2) >= 61 ? 'Positive' : 'Nagative'}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                직진성
                                            </TableCell>
                                            <TableCell>{(linearity * 100).toFixed(2)}%</TableCell>
                                            <TableCell>{(linearity * 100).toFixed(2) >= 55 ? 'Positive' : 'Nagative'}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        <div style={{ width: '80%', margin: '0 auto', padding: '30px' }}>
                            <Chart
                                width={400}
                                height={300}
                                chartType="ColumnChart"
                                loader={<div>Loading Chart</div>}
                                data={[
                                    ['linearity', 'value'],
                                    ['motility', motility],
                                    ['linearity', linearity]
                                ]}
                                legendToggle
                            />
                        </div>
                    </div>
                </div>}

            </div>
        )
    }

}
