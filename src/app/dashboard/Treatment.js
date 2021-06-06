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
        gridTemplateColumns: 'repeat(4, 1fr)',
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
}))

export default function Treatment({ match, history }) {
    const [treatments, setTreatment] = useState([])
    const [selected, setSelected] = useState(0)
    const classes = useStyles()


    useEffect(() => {
        if (match.params.id) Api('/treatment/info', { treatmentId: match.params.id }).then(res => {
            if (res.status !== 200) {

            } else setTreatment(res)
        })
        else history.push('/dashboard')
    }, [])

    if (match.params.id === undefined) {
        return <div></div>
        history.push('/dashboard')
    }

    if (treatments.length < 1) return <div></div>
    else {
        const { file, stop, small, large, motility, linearity, ...info } = treatments['analyzes'][selected]
        const chartData = [
            { country: 'stop', area: stop },
            { country: 'small', area: small },
            { country: 'large', area: large },
        ]
        return (
            <div>
                <div className={classes.navBox}>
                    {treatments['analyzes'].map((data, idx) =>
                        <div
                            className={`${classes.navItem} ${idx === selected ? classes.active : ''}`}
                            key={idx}
                            onClick={() => { setSelected(idx) }}
                        >검사결과({idx + 1})</div>)}
                </div>
                <div className={classes.section}>
                    <div className={classes.topSection}>
                        <div><video controls src={
                            `http://222.114.14.190:8080/treatment/stream/${treatments['analyzes'][selected]['file']['fileName']}`
                        }></video></div>
                        <div>
                            <TableContainer style={{ border: '1px solid grey' }}>
                                <Table className={classes.table} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>측정항목</TableCell>
                                            <TableCell>측정값</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.keys(info).map((key, idx) => (
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
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>등급</TableCell>
                                            <TableCell>값</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                small
                                            </TableCell>
                                            <TableCell>{small}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                stop
                                            </TableCell>
                                            <TableCell>{stop}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                large
                                            </TableCell>
                                            <TableCell>{large}</TableCell>
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
                                options={{
                                    title: 'My Daily Activities',
                                }}
                                rootProps={{ 'data-testid': '1' }}
                            />
                        </div>
                    </div>
                    <div className={classes.bottomSection}>
                        <div>
                            <TableContainer style={{ border: '1px solid grey', width: '80%' }}>
                                <Table className={classes.table} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>직진성</TableCell>
                                            <TableCell>값</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                활동성
                                            </TableCell>
                                            <TableCell>{(motility * 100).toFixed(2)}%</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                직진성
                                            </TableCell>
                                            <TableCell>{(linearity * 100).toFixed(2)}%</TableCell>
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
                </div>

            </div>
        )
    }

}
