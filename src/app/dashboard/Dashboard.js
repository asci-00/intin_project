import React, { Component, useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import Api from '../../apis/Api'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

export default function Dashboard(props) {
  const [patients, setPatient] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    Api('/patient', { hospitalId: 1 }).then(res => {
      console.log('api')
      if (res.status !== 200) {

      } else setPatient(res['patientTreatments'])
    })
  }, [])

  const onRowClick = (idx, type = false) => {
    if(selected !== null) props.history.push(`/treatment/${patients[selected]['treatmentDate'][idx]['id']}`)
    else setSelected(idx)
  }
  const getColumns = flag => {
    if(flag) return [
      { title: 'id', field: 'id' },
      { title: '이름', field: 'name' },
      { title: '생년월일', field: 'birth'},
      { title: '전화번호', field: 'phone'},
      { title: '성별', field: 'gender'},
      { title: '주소', field: 'address'}
    ]
    else return [
      { title: 'id', field: 'id', width:100 },
      { title: 'date', field: 'treatmentDate' },
    ]
  }
  const getData = idx => (idx !== null ? patients[idx]['treatmentDate'] : patients.map(data => data['patient']))

  return (
    <div>
      <div style={{
        width:'100%',
        textAlign:'right',
        marginBottom:'30px'
      }}>
        <Button color="primary" onClick={() => {
          if(selected !== null) setSelected(null)
        }}>돌아가기</Button>
      </div>
      <MaterialTable
        columns={getColumns(selected === null)}
        data={getData(selected)}
        title={selected === null ? "환자목록" : "진료목록"}
        onRowClick={
          (ev, data) => onRowClick(data.tableData.id)
        }
      />
    </div>
  )
}
