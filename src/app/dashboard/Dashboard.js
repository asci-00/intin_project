import React, { Component, useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import Api from '../../apis/Api'
import Button from '@material-ui/core/Button'

export default function Dashboard(props) {
  const [patients, setPatient] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    Api('/patient', { hospitalId: 1 }).then(res => {
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
      { title: 'id', field: 'id', width:300 },
      { title: '이름', field: 'name', width:300 },
      { title: '생년월일', field: 'birth', width:300},
      { title: '전화번호', field: 'phone', width:300},
      { title: '주소', field: 'address', width:300}
    ]
    else return [
      { title: 'id', field: 'id', width:100 },
      { title: 'date', field: 'treatmentDate' },
    ]
  }
  const getData = idx => (idx !== null ? patients[idx]['treatmentDate'] : patients.map(data => data['patient']))
  console.log(patients)
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
        options={{
          headerStyle: {
            backgroundColor: '#666',
            color: '#FFF'
          },
          actionsColumnIndex: -1
        }}
        actions={[
          {
            icon: 'upload',
            tooltip: 'Upload video',
            onClick: (event, rowData) => {
              props.history.push(`/upload/${rowData['hospitalUniqueNumber']}`)
            }
          }
        ]}
        components={{
          Action: props => (
            <div style={{textAlign:'center'}}><Button
            onClick={(event) => props.action.onClick(event, props.data)}
            color="primary"
            variant="contained"
            style={{textTransform: 'none'}}
            size="small"
          >
            진료영상업로드
          </Button></div>
          ),
        }}
      />
    </div>
  )
}
